import {ObjectId} from 'mongoose';
import Booking, {IBooking} from '../models/booking';

export default class BookingService {
  async bookRoom(bookingInfo: IBooking) {
    try {
      const booking = await Booking.create(bookingInfo);
      return booking._id;
    } catch (e) {
      return e as Error;
    }
  }

  async getBookingInfo(bookingId: any) {
    try {
      const booking = await Booking.findById(bookingId)
        .populate({
          path: 'rooms',
          select: 'number roomType',
          populate: {path: 'roomType', select: 'type rent'},
        }).select('-createdAt -updatedAt -__v');
      if (booking == null) {
        return Error('Booking not found!');
      } else {
        return booking;
      }
    } catch (error) {
      return error as Error;
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
      .select('_id paymentStatus customer.name customer.phone')
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
    }).select('_id paymentStatus customer.name customer.phone')
      .sort({createdAt: 'desc'});
    return bookings;
  }
  async getCustomerList(hotelId: ObjectId,
    customerPhone?: string, bookingStatus?: string) {
    const filter: any = {hotel: hotelId};
    if (customerPhone) {
      filter['customer.phone'] = customerPhone;
    }
    const customers = await Booking.find(filter)
      .select('customer.name customer.phone');
    return customers;
  }
  async getBookingCustomerList(hotelId: ObjectId, customerPhone?: string) {
    const filter: any = {
      hotel: hotelId,
      status: {$in: ['booked', 'checkedIn']},
    };

    if (customerPhone) {
      filter['customer.phone'] = customerPhone;
    }

    const customers = await Booking.find(filter)
      .select('_id customer.name customer.phone');

    return customers;
  }
}

