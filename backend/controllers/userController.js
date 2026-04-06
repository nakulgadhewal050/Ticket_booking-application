
// API controller function to get user bookings

import { clerkClient } from "@clerk/express";
import Booking from "../models/Booking.js";
import Movie from "../models/Movie.js";
import { syncUserFromClerk } from "../utils/syncUserFromClerk.js";

export const getUserBookings = async (req, res) => {
    try {
        const user = req.auth().userId;
        await syncUserFromClerk(user);

        const bookings = await Booking.find({ user }).populate({
            path: 'show',
            populate: { path: 'movie' }
        }).sort({ createdAt: -1 });

        res.json({ success: true, bookings });

    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
}

// API controller function to update favourite movie in clerk user metadata

export const updateFavouriteMovie = async (req, res) => {
    try {

        const { movieId } = req.body;
        const userId = req.auth().userId;
        await syncUserFromClerk(userId);

        const user = await clerkClient.users.getUser(userId);

        if (!user.privateMetadata.favorites) {
            user.privateMetadata.favorites = [];
        }

        if (!user.privateMetadata.favorites.includes(movieId)) {
            user.privateMetadata.favorites.push(movieId);
        } else {
            user.privateMetadata.favorites = user.privateMetadata.favorites.filter(item => item !== movieId)
        }

        await clerkClient.users.updateUserMetadata(userId, { privateMetadata: user.privateMetadata });

        res.json({ success: true, message: "favourite movie updated successfully" });


    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
}


export const getFavouriteMovies = async (req, res) => {
    try {
          const userId = req.auth().userId;
          await syncUserFromClerk(userId);
          const user = await clerkClient.users.getUser(userId);
          const favorites = user.privateMetadata.favorites;

          //getting movies from database

          const movies = await Movie.find({ _id: { $in: favorites } });

          res.json({ success: true, movies });

    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
}
