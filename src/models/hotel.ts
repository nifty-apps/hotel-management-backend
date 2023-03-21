import {model, Schema} from 'mongoose';

export interface IHotel {
  name: string,
  ownerName: string,
  address: string,
  contactNumber: string,
}

const schema = new Schema<IHotel>({
  name: {
    type: String,
    required: true,
  },
  ownerName: {
    type: String,
    required: true,
  },

  address: {
    type: String,
    required: true,
  },
  contactNumber: {
    type: String,
  },
});

export default model<IHotel>('Hotel', schema);
