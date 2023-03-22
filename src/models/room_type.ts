import {model, Schema} from 'mongoose';

export interface IRoomType {
  roomType: string,
  rent: number,
  description?: string,
  hotel: Schema.Types.ObjectId,
}

const schema = new Schema<IRoomType>({
  roomType: {
    type: String,
    required: true,
  },
  rent: {
    type: Number,
    required: true,
    trim: true,
  },
  description: {
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

export default model<IRoomType>('RoomType', schema);
