import jwt from 'jsonwebtoken';
import HttpError from '../models/http-error.js';

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (req.user) return next();
  if (!authHeader || !authHeader.startsWith('Bearer'))
    return next(new HttpError('Please authenticate.', 401));

  const token = authHeader.split(' ')[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { userId: payload._id };
    req.token = token;

    next();
  } catch (e) {
    console.log(e);
    return next(new HttpError('Please logout and login again.', 401));
  }
};

export default authMiddleware;
