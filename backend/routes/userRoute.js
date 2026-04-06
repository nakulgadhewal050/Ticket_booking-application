import express from "express";
import { getFavouriteMovies, getUserBookings, updateFavouriteMovie } from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.get('/bookings', getUserBookings);
userRouter.post('/update_favorite', updateFavouriteMovie);
userRouter.get('/favorites', getFavouriteMovies);


export default userRouter;