
import {Date, model, Schema} from 'mongoose';

export interface IBooking {
  customer: {
    name: string;
    phone: string;
    address: string;
  },
  rent: number;
  checkIn: Date;
  checkOut: Date;
  room: Schema.Types.ObjectId;
  hotel: Schema.Types.ObjectId;
}

const schema = new Schema<IBooking>({
  customer: {
    type: {
      name: {
        type: String,
        required: true,
      },
      phone: {
        type: String,
        required: true,
      },
      address: {
        type: String,
        required: true,
      },
    },
    required: true,
  },
  rent: {
    type: Number,
    required: true,
  },
  checkIn: {
    type: Date,
    required: true,
  },
  checkOut: {
    type: Date,
    required: true,
  },
  room: {
    type: Schema.Types.ObjectId,
    ref: 'Room',
    required: true,
  },
  hotel: {
    type: Schema.Types.ObjectId,
    ref: 'Hotel',
    required: true,
  },
}, {
  timestamps: true,
},
);

export default model<IBooking>('Booking', schema);
