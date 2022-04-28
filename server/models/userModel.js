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
    password: { type: String, trim: true, minLength: 7, required: true },
    isAdmin: { type: Boolean, default: false, required: true },
    tokens: [{ token: { type: String, required: true } }],
  }, // array of tokens to support login for multiple devices
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

userSchema.methods.generateAuthToken = async function () {
  const token = jwt.sign({ _id: this.id.toString() }, process.env.JWT_SECRET, {
    expiresIn: '5h',
  });
  this.tokens = [...this.tokens, { token }];
  await this.save();
  return token;
};

const User = mongoose.model('User', userSchema);

export default User;
