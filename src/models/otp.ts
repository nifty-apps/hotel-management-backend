import {Schema, model} from 'mongoose';
interface IOTP {
  email: string;
  otp: number;
  createdAt: Date;
}

const OTPSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  otp: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    expires: '1h',
    default: Date.now,
  },
});

export default model<IOTP>('OTP', OTPSchema);
