import Room from '../models/room';
import {IUser} from '../models/user';

export default class DashboardService {
  async getDashboardInfo(user: IUser) {
    try {
      const totalRooms = await Room.find({hotel: user.hotel}).count();
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
