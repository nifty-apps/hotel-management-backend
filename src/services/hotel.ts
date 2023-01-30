import User from '../models//user';
import Hotel, {IHotel} from '../models/hotel';
export default class HotelService {
  async addHotel(hotelData: IHotel, userId: any) {
    try {
      const result = await Hotel.findOne({name: hotelData.name});
      if (result) {
        return Error('Hotel name already exists!');
      }
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
}
