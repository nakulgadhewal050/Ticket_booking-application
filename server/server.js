import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './configs/db.js';
import { clerkMiddleware } from '@clerk/express'
import { inngest, functions } from './inngest/index.js';
import { serve } from 'inngest/express';
import showRouter from './routes/showRoutes.js';
import bookingRouter from './routes/bookingRoute.js';
import adminRouter from './routes/adminRoute.js';
import userRouter from './routes/userRoute.js';



const app = express();
const PORT = 3000

await connectDB();

//Middleware
app.use(clerkMiddleware());
app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {res.send('Server is running')});


app.use('/api/inngest', serve({client: inngest, functions}));    
app.use('/api/show', showRouter);
app.use('/api/booking', bookingRouter);
app.use('/api/admin', adminRouter);
app.use('/api/user', userRouter);

app.listen(PORT, () => {
    console.log(`server is running on http://localhost:${PORT}`);
})
