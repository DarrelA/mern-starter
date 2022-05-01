import fs from 'fs';
import jwt from 'jsonwebtoken';
import util from 'util';
import { deleteAvatar, getFileStream, uploadFile } from '../db/s3.js';
import HttpError from '../models/http-error.js';
import User from '../models/userModel.js';

const unlinkFile = util.promisify(fs.unlink);

const register = async (req, res, next) => {
  const { name, email, password } = req.body;
  if (!name || !email || password.length <= 7)
    return next(new HttpError('Please provide all values.', 404));

  if (await User.findOne({ email }))
    return next(new HttpError('Email is taken.', 400));

  try {
    const user = await User.create({ name, email, password });
    const accessToken = user.createAccessToken(user._id);
    const refreshToken = user.createRefreshToken(user._id);

    user.refreshToken = refreshToken;
    await user.save();
    user.sendRefreshToken(res, refreshToken);
    return res
      .status(201)
      .send({ passport: false, _id: user._id, accessToken });
  } catch (e) {
    console.log(e);
    return next(new HttpError('Failed to register.', 400));
  }
};

const login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    const { _id, avatar, name, isAdmin } = user;
    const { googleId } = user;

    if (googleId)
      return next(new HttpError('Please login using google button,', 404));
    else if (user && (await user.comparePassword(password))) {
      const accessToken = user.createAccessToken(user._id);
      const refreshToken = user.createRefreshToken(user._id);

      user.refreshToken = refreshToken;
      await user.save();
      user.sendRefreshToken(res, refreshToken);
      return res.send({
        passport: false,
        _id,
        avatar,
        name,
        isAdmin,
        accessToken,
      });
    }

    return next(new HttpError('Invalid credentials.', 401));
  } catch (e) {
    console.log(e);
    return next(new HttpError('Something went wrong!', 401));
  }
};

const logout = async (req, res, next) => {
  try {
    req.logout();
    req.session.destroy();
    res
      .clearCookie('connect.sid')
      .clearCookie('refreshToken', { path: '/api/user/refresh_token' })
      .send({ message: 'Logged out' });
  } catch (e) {
    console.log(e);
    return next(new HttpError('Something went wrong!', 500));
  }
};

const checkRefreshToken = async (req, res, next) => {
  const token = req.cookies.refreshToken;
  if (!token) return next(new HttpError('Please authenticate', 401));

  try {
    const payload = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
    const user = await User.findById(payload.userId);
    const { googleId, _id, name, avatar, isAdmin } = user;

    if (!user || user.refreshToken !== token)
      return next(new HttpError('Please authenticate', 401));

    const accessToken = user.createAccessToken(user._id);
    const refreshToken = user.createRefreshToken(user._id);

    user.refreshToken = refreshToken;
    await user.save();
    user.sendRefreshToken(res, refreshToken);

    return res.send({ googleId, _id, avatar, name, isAdmin, accessToken });
  } catch (e) {
    console.log(e);
    res.send({ accessToken: '' });
  }
};

const fetchPassportUserData = async (req, res, next) => {
  try {
    if (req.user) {
      const { _id, googleId, name, isAdmin } = req.user; // From passport
      const user = await User.findById(_id || req.user.userId); // From db
      res.send({
        _id: _id || user._id,
        passport: !!googleId || false,
        name: name || user.name,
        isAdmin: isAdmin || user.isAdmin,
        avatar: user.avatar || '',
      });
    } else return next(new HttpError('User not found.', 404));
  } catch (e) {
    console.log(e);
  }
};

const updateProfile = async (req, res, next) => {
  const user = await User.findById(req.user.userId);
  const updateFields = Object.keys(req.body);
  // Dynamically fetching fields from the Mongoose model
  const allowedUpdateFields = ['image', 'name', 'email', 'password'];
  const isValidUpdateField = updateFields.every((updateField) =>
    allowedUpdateFields.includes(updateField)
  );

  if (!isValidUpdateField)
    return next(new HttpError('Invalid update field.', 400));

  try {
    updateFields.forEach(
      (updateField) =>
        (user[updateField] = req.body[updateField]
          ? req.body[updateField]
          : user[updateField])
    );
    await user.save();
    res.send({
      passport: false,
      _id: user._id,
      name: user.name,
      message: 'success',
    });
  } catch (e) {
    console.log(e);
    return next(new HttpError('Something went wrong!', 500));
  }
};

const uploadAvatar = async (req, res, next) => {
  const user = await User.findById(req.user.userId || req.user._id);
  try {
    if (!!user.avatar) {
      const key = user.avatar;
      deleteAvatar(key);
    }
    const result = await uploadFile(req.file); // uploadFile to S3
    await unlinkFile(req.file.path); // delete file from avatars folder once it is uploaded to s3

    user.avatar = result.Key;
    await user.save();
    res.send({ avatar: result.Key });
  } catch (e) {
    console.log(e);
    return next(new HttpError('Something went wrong!', 500));
  }
};

const getAvatar = (req, res, next) => {
  try {
    const readStream = getFileStream(req.params.key);
    readStream.pipe(res);
  } catch (e) {
    console.log(e);
    return next(new HttpError('Something went wrong!', 500));
  }
};

const deleteProfile = async (req, res, next) => {
  const user = await User.findById(req.user.userId);
  try {
    await user.remove();
    res.json({ message: 'User is removed successfully.' });
  } catch (e) {
    return next(new HttpError('Something went wrong!', 500));
  }
};

export {
  register,
  login,
  logout,
  checkRefreshToken,
  fetchPassportUserData,
  updateProfile,
  uploadAvatar,
  getAvatar,
  deleteProfile,
};
