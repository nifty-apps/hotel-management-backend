
import {ObjectId} from 'mongoose';
import Room from '../models/room';

export default class DashboardService {
  async getDashboardInfo(userId: ObjectId) {
    try {
      const totalRooms = await Room.find({hotel: userId}).count();
      const summary = {
        totalRooms,
        bookedRooms: 0,
        availableRooms: 0,
        todayBookings: 0,
      };
      const recentBookings: any = [];
      return {summary, recentBookings};
    } catch (error) {
      return error as Error;
    }
  }
}
