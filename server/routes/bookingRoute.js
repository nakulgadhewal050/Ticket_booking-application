import express from "express";
import { createBooking, getOccupiedSeats } from "../controllers/bookingController.js";

const bookingRouter = express.Router();

bookingRouter.post('/create_booking', createBooking);
bookingRouter.get('/seats/:showId', getOccupiedSeats);

export default bookingRouter;