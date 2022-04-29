import fs from 'fs';
import util from 'util';
import { deleteAvatar, getFileStream, uploadFile } from '../db/s3.js';
import HttpError from '../models/http-error.js';
import User from '../models/userModel.js';

const unlinkFile = util.promisify(fs.unlink);

const fetchUser = async (req, res, next) => {
  try {
    if (req.user) {
      const { _id, googleId, name, isAdmin } = req.user; // From passport
      const user = await User.findById(_id || req.user.userId); // From db
      res.send({
        _id: _id || user._id,
        googleId: googleId || '',
        name: name || user.name,
        isAdmin: isAdmin || user.isAdmin,
        avatar: user.avatar || '',
      });
    } else return next(new HttpError('User not found.', 404));
  } catch (e) {
    console.log(e);
  }
};

const register = async (req, res, next) => {
  const { name, email, password } = req.body;
  if (!name || !email || password.length <= 7)
    return next(new HttpError('Please provide all values.', 404));

  if (await User.findOne({ email }))
    return next(new HttpError('Email is taken.', 400));

  const user = new User(req.body);

  try {
    const token = await user.generateAuthToken();
    res.status(201).send({
      _id: user._id,
      isAdmin: user.isAdmin,
      token,
    });
  } catch (e) {
    console.log(e);
    return next(new HttpError('Failed to register.', 400));
  }
};

const login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user && (await user.comparePassword(password)))
      return res.send({
        _id: user._id,
        avatar: user.avatar,
        name: user.name,
        isAdmin: user.isAdmin,
        token: await user.generateAuthToken(),
      });

    return next(new HttpError('Invalid credentials.', 401));
  } catch (e) {
    console.log(e);
    return next(new HttpError('Something went wrong!', 401));
  }
};

const logout = async (req, res, next) => {
  if (req.user) {
    try {
      req.logOut();
      res.status(200).clearCookie('connect.sid');
      req.session.destroy(function (err) {
        res.redirect('/register');
      });
    } catch (e) {
      console.log(e);
      return next(new HttpError('Something went wrong!', 500));
    }
  } else {
    const user = await User.findById(req.user.userId);
    if (!user) return res.send('Logout sucessfully!');
    try {
      user.tokens = user.tokens.filter((token) => token.token !== req.token);
      await user.save();
      res.send('Logout sucessfully!');
    } catch (e) {
      console.log(e);
      return next(new HttpError('Something went wrong!', 500));
    }
  }
};

const logoutAll = async (req, res, next) => {
  const user = await User.findById(req.user.userId);
  try {
    user.tokens = [];
    await user.save();
    res.send('Sucessfully logout from all devices!');
  } catch (e) {
    console.log(e);
    return next(new HttpError('Something went wrong!', 500));
  }
};

const updateProfile = async (req, res, next) => {
  const user = await User.findById(req.user.userId);
  if (user && (await user.comparePassword(req.body.currentPassword))) {
    delete req.body.currentPassword;
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
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        message: 'success',
      });
    } catch (e) {
      console.log(e);
      return next(new HttpError('Something went wrong!', 500));
    }
  } else return next(new HttpError('Invalid credentials.', 401));
};

const uploadAvatar = async (req, res, next) => {
  const user = await User.findById(req.user.userId || req.user._id);
  try {
    if (!!user.avatar) {
      const key = user.avatar;
      const result = deleteAvatar(key);
      console.log(result);
    }
    const result = await uploadFile(req.file); // uploadFile to S3

    // delete file from folder once it is uploaded to s3
    await unlinkFile(req.file.path);

    user.avatar = `${result.Key}`;
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
  fetchUser,
  register,
  login,
  logout,
  logoutAll,
  updateProfile,
  uploadAvatar,
  getAvatar,
  deleteProfile,
};
