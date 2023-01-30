import Logger from '../loaders/logger';
import Room, {IRoom} from '../models/room';
export default class RoomService {
  async addRoom(roomData: IRoom) {
    try {
      const room = await Room.findOne(
        {floor: roomData.floor},
        {number: roomData.number});
      if (room?.number == roomData.number && room.floor == roomData.floor) {
        return Error('Room is not be duplicate!');
      };
      const newRoom = await Room.create(roomData);
      return newRoom;
    } catch (error) {
      Logger.info(error);
      return error as Error;
    }
  }
}


