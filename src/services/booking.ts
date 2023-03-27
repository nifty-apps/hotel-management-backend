import Booking, {IBooking} from '../models/booking';

export default class BookingService {
  async bookRoom(bookingInfo: IBooking) {
    try {
      const booking = await Booking.create(bookingInfo);
      return booking;
    } catch (e) {
      return e as Error;
    }
  }
  async updateBookingInfo(bookingInfo: IBooking, bookingId: any) {
    try {
      const booking = await Booking.
        findByIdAndUpdate(bookingId, bookingInfo, {new: true});
      if (booking == null) {
        return Error('Booking not found!');
      }
      return booking;
    } catch (error) {
      return error as Error;
    }
  }
}
