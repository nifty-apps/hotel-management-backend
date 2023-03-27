
import {Date, model, Schema} from 'mongoose';

export interface IBooking {
  customer: {
    name: string;
    phone: string;
  },
  rooms: Schema.Types.ObjectId[];
  checkIn: Date;
  checkOut: Date;
  status: string;
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
    },
    required: true,
  },
  rooms: {
    type: [{type: Schema.Types.ObjectId, ref: 'Room'}],
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
  status: {
    type: String,
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
