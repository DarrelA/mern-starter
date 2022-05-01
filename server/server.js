import cookieParser from 'cookie-parser';
import cors from 'cors';
import 'dotenv/config';
import express from 'express';
import session from 'express-session';
import passport from 'passport';
import path from 'path';
import connectDB from './db/connectDB.js';
import {
  errorMiddleware,
  notFoundMiddleware,
} from './middleware/errorMiddleware.js';
import './passports/google-oauth20.js';
import passportRoutes from './routes/passportRoutes.js';
import userRoutes from './routes/userRoutes.js';

const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(
  session({
    secret: process.env.COOKIE_KEY,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // Set true for https connections
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(cookieParser());
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));

app.use('/api/auth', passportRoutes);
app.use('/api/user', userRoutes);
const __dirname = path.resolve();
app.use(
  '/server/uploads/avatars',
  express.static(path.join(__dirname, 'uploads/avatars'))
);

app.use(notFoundMiddleware);
app.use(errorMiddleware);

connectDB();
app.listen(port, () => console.log(`Port: ${port}`));
