import express from 'express';
import cors from 'cors';
import 'dotenv/config';

import { clerkMiddleware, requireAuth } from '@clerk/express'
import router from './routes/aiRoutes.js';
import connectCloudinary from './config/cloudinary.js';
import userRouter from './routes/userRoutes.js';

const app = express();

await connectCloudinary();

const PORT = process.env.PORT || 3000;

// app.use(cors());
app.use(cors({
  origin: "https://smart-genie-gamma.vercel.app",  // frontend URL
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use(express.json());
app.use(clerkMiddleware());
app.use(express.urlencoded({ extended:false }));

app.get('/', (req, res) => {
  res.send('Hello World!');
});



app.use(requireAuth()); // it is recommended to use this middleware for all routes that require authentication


app.use('/api/ai', router);
app.use('/api/user', userRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
