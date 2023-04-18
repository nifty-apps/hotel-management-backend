import {model, Schema} from 'mongoose';

export interface ITransaction {
  amount: number,
  paymentMethod: string,
  booking: Schema.Types.ObjectId,
  hotel: Schema.Types.ObjectId,
}

const schema = new Schema<ITransaction>({
  amount: {
    type: Number,
    required: true,
  },
  paymentMethod: {
    type: String,
    enum: ['cash'],
    required: true,
  },
  booking: {
    type: Schema.Types.ObjectId,
    ref: 'Booking',
    required: true,
  },
  hotel: {
    type: Schema.Types.ObjectId,
    ref: 'Hotel',
    required: true,
  },
}, {
  timestamps: true,
});

export default model<ITransaction>('Transaction', schema);
