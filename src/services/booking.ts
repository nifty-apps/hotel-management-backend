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

  async getRecentBookings(hotelId: Object) {
    const bookings = await Booking.find({hotel: hotelId})
      .select('_id customer.name customer.phone')
      .sort({createdAt: 'desc'})
      .limit(30);
    return bookings;
  }
  async getBookingsList(hotelId: Object, checkinDate: any,
    checkoutDate: any, status: string) {
    const bookings = await Booking.find({
      hotel: hotelId,
      status: status,
      checkIn: {$gte: new Date(checkinDate), $lte: new Date(checkoutDate)},
      checkOut: {$gte: new Date(checkinDate), $lte: new Date(checkoutDate)},
    }).select('_id customer.name customer.phone').sort({createdAt: 'desc'});
    return bookings;
  }
}


