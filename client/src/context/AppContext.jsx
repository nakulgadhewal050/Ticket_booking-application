import { useContext, createContext, useState } from "react";
import axios from "axios";
import { useAuth, useUser } from "@clerk/clerk-react";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useEffect } from "react";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;


export const AppContext = createContext()

export const AppProvider = ({ children }) => {

    const [isAdmin, setIsAdmin] = useState(false);
    const [shows, setShows] = useState([]);
    const [favoriteMovies, setFavoriteMovies] = useState([]);

    const image_base_url = import.meta.env.VITE_TMDB_IMAGE_URL;

    const { user } = useUser();
    const { getToken } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

const fetchIsAdmin = async () => {
    try {
        const { data } = await axios.get('/api/admin/is_admin', {
            headers: { Authorization: `Bearer ${await getToken()}` }
        });

        setIsAdmin(data.isAdmin);

        // agar user admin nahi hai aur admin page open kar raha hai
        if (!data.isAdmin && location.pathname.startsWith('/admin')) {
            toast.error("Access Denied! Admins Only");
            navigate('/');
        }

    } catch (error) {
        console.log(error);
        toast.error("Something went wrong");
    }
};
    const fetchShows = async () => {
        try {
            const { data } = await axios.get('/api/show/all_shows')
            if (data.success) {
                setShows(data.shows);
            } else {
                toast.error(data.message);
            }

        } catch (error) {
            console.log(error)
        }
    }


    const fetchFavoriteMovies = async () => {
        try {
            const { data } = await axios.get('/api/user/favorites', {
                headers: { Authorization: `Bearer ${await getToken()}` }
            })

            if (data.success) {
                setFavoriteMovies(data.movies );
            } else {
                toast.error(data.message);
            }

        } catch (error) {
            console.log(error)
        }
    }


    useEffect(() => {
        fetchShows();
    }, [])


    useEffect(() => {
        if (user) {
            fetchIsAdmin();
            fetchFavoriteMovies();
        }

    }, [user])


    const value = {
        axios, fetchIsAdmin, favoriteMovies,
        fetchFavoriteMovies, user, getToken,
        navigate, isAdmin, shows, image_base_url,
    }

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    )
}

export const useAppContext = () => useContext(AppContext)
