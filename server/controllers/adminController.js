import Booking from "../models/Booking.js";
import Show from "../models/Show.js";
import User from "../models/User.js";
import { clerkClient } from "@clerk/express";


// API to check if user is admin

export const isAdmin = async (req, res) => {
  try {
    const { userId } = req.auth();

    const user = await clerkClient.users.getUser(userId);
    const isAdmin = user.privateMetadata.role === "admin";

    return res.json({
      success: true,
      isAdmin,
    });
  } catch (error) {
    console.error("🔥 isAdmin error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to check admin status",
      error: error.message,
    });
  }
};



// API to get dashboard data

export const getDashboardData = async (req, res) => {
    try {
        const bookings = await Booking.find({ isPaid: true });
        const activeShows = await Show.find().populate('movie');

        const totalUsers = await User.countDocuments();

        const dashboardData = {
            totalBookings: bookings.length,
            totalRevenue: bookings.reduce((acc, booking) => acc + booking.amount, 0),
            activeShows,
            totalUsers,
        }

        res.json({ success: true, dashboardData });

    } catch (error) {
        console.error(error);
        res.json({ success: false, message: "Failed to fetch dashboard data", error: error.message });

    }
}

// API to get all shows

export const getAllShows = async (req, res) => {
    try {

        const shows = (await Show.find().populate('movie')).toSorted({ showDateTime: 1 });
        res.json({ success: true, shows })

    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });

    }


}


// API to get all bookings

export const getAllBookings = async (req, res) => {
    try {
          const bookings = await Booking.find().populate('user').populate({
            path: 'show',
            populate: { path: 'movie' }
          }).sort({ createdAt: -1 });
 
          res.json({ success: true, bookings });

    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
}