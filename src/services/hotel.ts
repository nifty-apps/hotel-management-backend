import {ObjectId} from 'mongoose';
import User from '../models//user';
import Hotel, {IHotel} from '../models/hotel';
export default class HotelService {
  async addHotel(hotelData: IHotel, userId: any) {
    try {
      const hotel = await Hotel.create(hotelData);
      if (hotel) {
        await User.findByIdAndUpdate({_id: userId}, {
          $set: {
            hotel: hotel._id,
          },
        });
      }
      return hotel;
    } catch (error) {
      return error as Error;
    }
  }
  async updateHotelInfo(hotelId: ObjectId, hotelData: IHotel) {
    try {
      const hotel = await Hotel.findByIdAndUpdate({_id: hotelId}, hotelData);
      if (hotel != null) {
        return hotel;
      }
      return new Error('Hotel not found');
    } catch (error) {
      return error as Error;
    }
  }
}
