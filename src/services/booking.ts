import Logger from '../loaders/logger';
import Booking, {IBooking} from '../models/booking';

export default class BookingService {
  async bookRoom(bookingInfo: IBooking) {
    const rooms = await Booking.find({
      room: bookingInfo.room,
      checkIn: {$gte: bookingInfo.checkIn},
      checkOut: {$lte: bookingInfo.checkOut},
    });
    Logger.info(rooms.length);
    if (rooms.length != 0) {
      return Error('This room not available for those days!');
    } else {
      const booking = await Booking.create(bookingInfo);
      return booking;
    }
  }
}
