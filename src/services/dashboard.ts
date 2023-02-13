
import {ObjectId} from 'mongoose';
import Booking from '../models/booking';
import Room from '../models/room';

export default class DashboardService {
  async getDashboardInfo(userId: ObjectId) {
    try {
      const start = new Date();
      start.setHours(0, 0, 0, 0);
      const end = new Date(start);
      end.setDate(end.getDate() + 1);
      const totalRooms = await Room.find({hotel: userId}).count();
      const todayBookings = await Booking.find({
        hotel: userId,
        checkIn: {$gte: start, $lt: end},
      }).count();
      const summary = {
        totalRooms,
        todayRevenue: 0,
        todayBookings,
        todayCheckIn: 0,
      };
      const recentBookings: any = [];
      return {summary, recentBookings};
    } catch (error) {
      return error as Error;
    }
  }
}
