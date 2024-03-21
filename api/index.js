import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRouter from './routes/user.route.js';
import authRouter from './routes/auth.route.js';
dotenv.config();

mongoose.connect(process.env.MONGO_URL)
      .then(() => {
            console.log('Connected to MongoDB');
      })
      .catch((err) => {
            console.log(err);
      })

const app = express();
app.use(express.json());

app.listen(3000, () => {
      console.log('Server is running on the port 3000');
})

app.get('/test', (req, res) => {
      res.json({
            message: "Hello world!",
      });
});

app.use('/api/user', userRouter);
app.use('/api/auth', authRouter);