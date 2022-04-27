import HttpError from '../models/http-error.js';
import User from '../models/userModel.js';

const register = async (req, res, next) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password)
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
        name: user.name,
        isAdmin: user.isAdmin,
        token: await user.generateAuthToken(),
      });

    return next(new HttpError('Invalid credentials.', 401));
  } catch (e) {
    return next(new HttpError('Something went wrong!', 401));
  }
};

const logout = async (req, res, next) => {
  const user = await User.findById(req.user.userId);
  try {
    user.tokens = user.tokens.filter((token) => token.token !== req.token);
    await user.save();
    res.send('Logout sucessfully!');
  } catch (e) {
    console.log(e);
    return next(new HttpError('Something went wrong!', 500));
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
    const allowedUpdateFields = ['name', 'email', 'password'];
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

const deleteProfile = async (req, res, next) => {
  const user = await User.findById(req.user.userId);
  try {
    await user.remove();
    res.json({ message: 'User is removed successfully.' });
  } catch (e) {
    return next(new HttpError('Something went wrong!', 500));
  }
};

export { register, login, logout, logoutAll, updateProfile, deleteProfile };
