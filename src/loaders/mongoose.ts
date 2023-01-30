import mongoose from 'mongoose';
import config from '../config';
mongoose.set('strictQuery', true);
export default async () => {
  await mongoose.connect(config.databaseURL);
};
