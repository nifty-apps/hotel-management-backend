import {model, Schema} from 'mongoose';

export interface IHotel {
  name: string,
  address: string
}

const schema = new Schema<IHotel>({
  name: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
});

export default model<IHotel>('Hotel', schema);
