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
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token,
    });
  } catch (e) {
    console.log(e);
    return next(new HttpError('Failed to register.', 400));
  }
};

export { register };
