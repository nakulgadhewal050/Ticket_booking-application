import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { assets } from '../assets/assets.js'
import { MenuIcon, SearchIcon, TicketPlus, XIcon } from 'lucide-react'
import { useClerk, UserButton, useUser } from '@clerk/clerk-react'
import { useAppContext } from '../context/AppContext.jsx'

function Nav() {
    const {favoriteMovies} = useAppContext();
    const [menuOpen, setMenuOpen] = useState(false)
    const { user } = useUser()
    const { openSignIn } = useClerk()
    const navigate = useNavigate()
    const [showNav, setShowNav] = useState(true)
    const [lastScrollY, setLastScrollY] = useState(0)

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > lastScrollY && window.scrollY > 100) {

                setShowNav(false)
            } else {

                setShowNav(true)
            }
            setLastScrollY(window.scrollY)
        }

        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [lastScrollY])

   

    return (
        <div className={`fixed top-0 left-0 z-50 w-full flex items-center justify-between 
  px-6 md:px-16 lg:px-36 py-5 bg-transparent backdrop-transparent 
  transition-transform duration-500 ${showNav ? 'translate-y-0' : '-translate-y-full'}`}>

            <Link to='/' className='max-md:flex-1'>
                <img src={assets.logo} alt='Logo' className='w-36 h-auto' />
            </Link>


            <div
                className={`${menuOpen ? 'max-md:left-0' : 'max-md:-left-full'
                    } max-md:absolute max-md:top-0 max-md:w-full max-md:h-screen 
        flex flex-col md:flex-row items-center justify-center gap-8 
        md:px-8 py-3 md:rounded-full backdrop-blur bg-black/70 md:bg-white/10 
        md:border border-gray-300/20 overflow-hidden transition-all duration-300`}>

                <XIcon
                    className='md:hidden absolute top-6 right-6 w-6 h-6 cursor-pointer'
                    onClick={() => setMenuOpen(false)}
                />

                <Link to='/' onClick={() => setMenuOpen(false)}>Home</Link>
                <Link to='/movies' onClick={() => setMenuOpen(false)}>Movies</Link>
                <Link to='/theaters' onClick={() => setMenuOpen(false)}>Theaters</Link>
                <Link to='/releases' onClick={() => setMenuOpen(false)}>Releases</Link>
                <Link to='/favourite' onClick={() => {scroll(0,0); setMenuOpen(false)}}>Favorites</Link>
            </div>


            <div className='flex items-center gap-8'>
                <SearchIcon className='max-md:hidden w-6 h-6 cursor-pointer' />
                {!user ? (
                    <button className='px-4 py-1 sm:px-7 sm:py-2 bg-primary hover:bg-primary-dull transition rounded-full font-medium cursor-pointer'
                        onClick={() => openSignIn()}>
                        Login
                    </button>
                ) : (
                    <UserButton>
                        <UserButton.MenuItems>
                            <UserButton.Action label='My Bookings'
                                labelIcon={<TicketPlus width={15} />}
                                onClick={() => navigate('/mybookings')} />
                        </UserButton.MenuItems>
                    </UserButton>
                )}

            </div>


            <MenuIcon
                className='max-md:ml-4 md:hidden w-8 h-8 cursor-pointer'
                onClick={() => setMenuOpen(true)}
            />
        </div>
    )
}

export default Nav
