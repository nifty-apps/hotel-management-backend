
import Booking from '../models/booking';
import Room from '../models/room';
import Transaction from '../models/transaction';

//dashboard
export default class DashboardService {
  async getDailyReport(hotelId: any) {
    try {
      const today = new Date().setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const todayBookings = await Booking.countDocuments({
        hotel: hotelId,
        createdAt: {$gte: today, $lt: tomorrow},
      });

      const todayBooked = await Booking.countDocuments({
        hotel: hotelId,
        checkIn: {$lte: tomorrow},
        checkOut: {$gte: today},
        status: 'booked',
      });

      const todayCheckedIn = await Booking.countDocuments({
        hotel: hotelId,
        checkIn: {$lte: tomorrow},
        checkOut: {$gte: today},
        status: 'checkedIn',
        createdAt: {$gte: today, $lt: tomorrow},
      });

      const bookedRooms = await Booking.distinct('rooms', {
        hotel: hotelId,
        checkIn: {$lte: new Date()},
        checkOut: {$gte: new Date()},
        status: 'booked',
        createdAt: {$gte: today, $lt: tomorrow},
      });

      const availableRooms = await Room.countDocuments({
        _id: {$nin: bookedRooms},
        hotel: hotelId,
      });

      const todayTransaction = await Transaction.aggregate([

        {
          $match: {
            hotel: hotelId,
            createdAt: {$gte: new Date().toUTCString, $lt: tomorrow},
          },
        },
        {
          $group: {
            _id: null,
            totalAmount: {$sum: '$amount'},
          },
        },
      ]);
      const response = {
        todayBookings: todayBookings,
        todayBooked: todayBooked,
        todayCheckedIn: todayCheckedIn,
        todayAvailableRoom: availableRooms,
        todayCollection: todayTransaction.length > 0 ?
          todayTransaction[0].totalAmount : 0,
      };

      return response;
    } catch (err) {
      // Handle error
      throw err;
    }
  }
}
