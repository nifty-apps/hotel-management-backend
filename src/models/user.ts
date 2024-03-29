import {model, Schema} from 'mongoose';

export interface IUser {
  name: string,
  email: string,
  password: string,
  role: string,
  phone?: string,
  address?: string,
  hotel: Schema.Types.ObjectId
}
const schema = new Schema<IUser>({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    trim: true,
    required: true,
  },
  password: {
    type: String,
    trim: true,
    required: true,
    select: false,
  },
  role: {
    type: String,
    trim: true,
    required: true,
  },
  phone: {
    type: String,
    trim: true,
    default: null,
  },
  address: {
    type: String,
    default: null,
  },
  hotel: {
    type: Schema.Types.ObjectId,
    ref: 'Hotel',
  },
}, {
  timestamps: true,
});

export default model<IUser>('User', schema);
