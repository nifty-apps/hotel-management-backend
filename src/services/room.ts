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
          number: roomData.number,
          hotel: roomData.hotel,
          roomType: roomData.roomType,
        });
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

  async getTotalRooms(hotelId: ObjectId, roomNumber?: string) {
    const filter: {hotel: ObjectId, number?: string} = {hotel: hotelId};
    if (roomNumber) {
      filter['number'] = roomNumber;
    }

    const rooms = await Room.find(filter)
      .populate({
        path: 'roomType',
        select: '-hotel -createdAt -updatedAt -__v',
      }).select('-__v');

    return rooms;
  }

  async updateRoomInfo(roomData: IRoom, roomId: any) {
    const room = await Room.findByIdAndUpdate(roomId,
      {$set: roomData},
      {new: true});
    if (room == null) {
      return Error('Room not found!');
    }
    return room;
  }

  async getRecentBookings(hotelId: Object) {
    const bookings = await Booking.find({hotel: hotelId})
      .populate('room')
      .sort({createdAt: 'desc'})
      .limit(30);
    return bookings;
  }
  async getTodayBooked(hotelId: Object) {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const end = new Date(start);
    end.setDate(end.getDate() + 1);
    const bookings = await Booking.find({
      hotel: hotelId,
      checkIn: {$gte: start, $lt: end},
    }).populate('room').sort({createdAt: 'desc'});
    return bookings;
  }

  async getAvailableRooms(fromDate: any, toDate: any, hotelId: any) {
    try {
      const bookedRooms = await Booking.aggregate([
        {
          $match: {
            hotel: hotelId,
            checkIn: {$lt: new Date(toDate)},
            checkOut: {$gt: new Date(fromDate)},
          },
        },
        {
          $unwind: '$rooms',
        },
        {
          $group: {
            _id: null,
            bookedRooms: {$addToSet: '$rooms'},
          },
        },
      ]);

      const bookedRoomIds = bookedRooms.length > 0 ?
        bookedRooms[0].bookedRooms : [];

      const availableRooms = await Room.aggregate([
        {
          $match: {
            hotel: hotelId,
            _id: {$nin: bookedRoomIds},
          },
        },
        {
          $lookup: {
            from: 'roomtypes',
            localField: 'roomType',
            foreignField: '_id',
            as: 'roomType',
          },
        },
        {
          $unwind: '$roomType',
        },
        // {
        //   $project:
        //   {
        //     'hotel': 0,
        //     'createdAt': 0,
        //     'updatedAt': 0,
        //     '__v': 0,
        //     'roomType.hotel': 0,
        //     'roomType.createdAt': 0,
        //     'roomType.updatedAt': 0,
        //     'roomType.__v': 0,
        //   },
        // },
        {
          $group: {
            _id: '$roomType.type',
            count: {$sum: 1},
            rooms: {$push: '$$ROOT'},
          },
        },
        {
          $addFields: {
            'rooms.rent': {$first: '$rooms.roomType.rent'},
          },
        },
        {
          $project: {
            '_id': 0,
            'type': '$_id',
            'count': 1,
            'rooms._id': 1,
            'rooms.number': 1,
            'rooms.rent': 1,
          },
        },
      ]);

      return availableRooms;
    } catch (error) {
      return error as Error;
    }
  }

  async deleteRoom(roomId: any) {
    const room = await Room.findByIdAndDelete(roomId);
    if (room == null) {
      return Error('The room is not found!');
    }
    return room;
  }
}


