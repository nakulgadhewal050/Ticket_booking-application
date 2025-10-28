import express from 'express';
import { addShow, getNowPlayingMovies, getShow, getShows } from '../controllers/showController.js';
import { protectAdmin } from '../middleware/auth.js'; 

const showRouter = express.Router();

showRouter.get('/now_playing', protectAdmin,getNowPlayingMovies)
showRouter.post('/add_show', protectAdmin, addShow);
showRouter.get('/all_shows', getShows);
showRouter.get('/:movieId', getShow);
              
export default showRouter;


