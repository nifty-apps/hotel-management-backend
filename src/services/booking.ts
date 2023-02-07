import Logger from '../loaders/logger';
import Booking, {IBooking} from '../models/booking';
import Room from '../models/room';

export default class BookingService {
  async bookRoom(bookingInfo: IBooking) {
    Logger.info(bookingInfo.room);
    const room = await Room.findById(bookingInfo.room);
    if (room == null) {
      return Error('The room was not found!');
    } else {
      const booking = await Booking.create(bookingInfo);
      return booking;
    }
  }
}
