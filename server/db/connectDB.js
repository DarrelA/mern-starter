import chalk from 'chalk';
import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const connect = await mongoose.connect(process.env.MONGODB_URI);
    console.log(
      chalk.hex('#8E7DBE').underline(`MongoDB: ${connect.connection.host}`)
    );
  } catch (error) {
    console.error(`error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
