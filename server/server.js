import 'dotenv/config';
import express from 'express';
import path from 'path';
import connectDB from './db/connectDB.js';
import { getFileStream } from './db/s3.js';
import {
  errorMiddleware,
  notFoundMiddleware,
} from './middleware/errorMiddleware.js';
import userRoutes from './routes/userRoutes.js';

const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/images/:key', (req, res) => {
  console.log(req.params);
  const readStream = getFileStream(req.params.key);
  console.log(readStream);
  readStream.pipe(res);
});

const __dirname = path.resolve();
app.use(
  '/server/uploads/avatars',
  express.static(path.join(__dirname, 'uploads/avatars'))
);
app.use('/api/user', userRoutes);

app.use(notFoundMiddleware);
app.use(errorMiddleware);

connectDB();
app.listen(port, () => console.log(`Port: ${port}`));
