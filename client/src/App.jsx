import React from 'react'
import Nav from './components/Nav'
import { Route, Routes, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import Movies from './pages/Movies'
import MovieDetails from './pages/MovieDetails'
import SeatLayout from './pages/SeatLayout'
import MyBookings from './pages/MyBookings'
import Favorite from './pages/Favorite'
import { Toaster } from 'react-hot-toast'
import Footer from './components/Footer'
import Layout from './pages/admin/Layout'
import Dashboard from './pages/admin/Dashboard'
import AddShows from './pages/admin/AddShows'
import ListShows from './pages/admin/ListShows'
import ListBookings from './pages/admin/ListBookings'

function App() {

  const isAdminRoute = useLocation().pathname.startsWith('/admin');
  return (
    <>
      <Toaster />
      {!isAdminRoute && <Nav />}
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/movies' element={<Movies />} />
        <Route path='/movies/:id' element={<MovieDetails />} />
        <Route path='/movies/:id/:date' element={<SeatLayout />} />
        <Route path='/mybookings' element={<MyBookings />} />
        <Route path='/favourite' element={<Favorite />} />
        <Route path='/admin/*' element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path='addshows' element={<AddShows />} />
          <Route path='listshows' element={<ListShows />} />
          <Route path='listbookings' element={<ListBookings />} />
        </Route>
      </Routes>
      {!isAdminRoute && <Footer />}
    </>
  )
}

export default App