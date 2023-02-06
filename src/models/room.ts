
import {model, Schema} from 'mongoose';

export interface IRoom {
  floor: String,
  number: string,
  roomType: string,
  rent: number,
  hotel: Schema.Types.ObjectId,
}

const schema = new Schema<IRoom>({
  floor: {
    type: String,
    trim: true,
    required: true,
  },
  number: {
    type: String,
    trim: true,
    required: true,
  },
  roomType: {
    type: String,
    trim: true,
    required: true,
  },
  rent: {
    type: Number,
    trim: true,
    required: true,
  },
  hotel: {
    type: Schema.Types.ObjectId,
    trim: true,
    required: true,
  },
}, {
  timestamps: true,
});
export default model<IRoom>('Room', schema);
