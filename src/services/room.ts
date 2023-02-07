import {ObjectId} from 'mongoose';
import Logger from '../loaders/logger';
import Room, {IRoom} from '../models/room';
export default class RoomService {
  async addRoom(roomData: IRoom) {
    try {
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
}


