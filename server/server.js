import 'dotenv/config';
import express from 'express';
import connectDB from './db/connectDB.js';
import userRoutes from './routes/userRoutes.js';

const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/api/user', userRoutes);

connectDB();
app.listen(port, () => console.log(`Port: ${port}`));
