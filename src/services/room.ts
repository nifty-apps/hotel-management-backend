import {ObjectId} from 'mongoose';
import Logger from '../loaders/logger';
import Booking from '../models/booking';
import Room, {IRoom} from '../models/room';
export default class RoomService {
  async addRoom(roomData: IRoom) {
    try {
      Logger.info(roomData.hotel);
      const room = await Room.findOne(
        {
          hotel: roomData.hotel,
          floor: roomData.floor,
          number: roomData.number,
        });
      Logger.info(room);
      if (room) {
        return {
          message: 'The room will not be duplicated!',
        };
      } else {
        const newRoom = await Room.create(roomData);
        return newRoom;
      }
    } catch (error) {
      return error as Error;
    }
  }

  async getTotalRooms(hotelId: ObjectId) {
    const rooms = await Room.find({hotel: hotelId});
    return rooms;
  }

  async getRecentBookings(hotelId: Object) {
    const bookings = await Booking.find({hotel: hotelId})
      .populate('room')
      .sort({createdAt: 'desc'})
      .limit(30);
    return bookings;
  }
  async getTodayBookings(hotelId: Object) {
    Logger.info(new Date().toDateString());
    const bookings = await Booking.find({
      hotel: hotelId,
      checkIn: {$gte: new Date()},
    })
      .populate('room')
      .sort({createdAt: 'desc'});
    return bookings;
  }

  async deleteRoom(roomId: any) {
    const room = await Room.findByIdAndDelete(roomId);
    if (room == null) {
      return Error('The room is not found!');
    }
    return room;
  }
}


