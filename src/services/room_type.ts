
import RoomType, {IRoomType} from '../models/room_type';

export default class RoomTypeService {
  // add room type
  async addRoomType(data: IRoomType) {
    try {
      const roomType = await RoomType.create(data);
      return roomType;
    } catch (error) {
      return error as Error;
    }
  }
  // get room type list
  async getRoomTypeList(hotelId: any) {
    try {
      const data = await RoomType.find({hotel: hotelId});
      return data;
    } catch (error) {
      return error as Error;
    }
  }
  // update room type
  async updateRoomType(data: IRoomType, id: any) {
    try {
      const roomType = await RoomType.findByIdAndUpdate(id,
        {$set: data}, {new: true});
      return roomType;
    } catch (error) {
      return error as Error;
    }
  }
  // delete room type
  async deleteRoomType(id: any) {
    try {
      const roomType = await RoomType.findByIdAndDelete(id);
      return roomType;
    } catch (error) {
      return error as Error;
    }
  }
}
