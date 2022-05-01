import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

const userSchema = mongoose.Schema(
  {
    googleId: { type: String },
    avatar: { type: String },
    name: { type: String, trim: true, required: true },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      unique: true,
      required: true,
    },
    password: { type: String, trim: true, minLength: 7 },
    isAdmin: { type: Boolean, default: false },
    refreshToken: { type: String },
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.comparePassword = async function (inputPassword) {
  return await bcrypt.compare(inputPassword, this.password);
};

userSchema.methods.createAccessToken = (userId) =>
  jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '15m' });

userSchema.methods.createRefreshToken = (userId) =>
  jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '1d' });

userSchema.methods.sendRefreshToken = (res, refreshToken) => {
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    path: '/api/user/refresh_token',
  });
};

const User = mongoose.model('User', userSchema);

export default User;
