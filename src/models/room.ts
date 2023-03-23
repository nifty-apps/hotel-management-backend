
import {model, Schema} from 'mongoose';
// eslint-disable-next-line no-unused-vars

export interface IRoom {
  number: string,
  roomType: Schema.Types.ObjectId,
  hotel: Schema.Types.ObjectId,
}

const schema = new Schema<IRoom>({
  number: {
    type: String,
    trim: true,
    required: true,
  },
  roomType: {
    type: Schema.Types.ObjectId,
    ref: 'RoomType',
    trim: true,
    required: true,
  },
  hotel: {
    type: Schema.Types.ObjectId,
    ref: 'Hotel',
    trim: true,
    required: true,
  },
}, {
  timestamps: true,
});
export default model<IRoom>('Room', schema);
