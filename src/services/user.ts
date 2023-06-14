
import bcrypt from 'bcrypt';
import Hotel from '../models/hotel';
import Room from '../models/room';
import RoomType from '../models/room_type';
import Transaction from '../models/transaction';
import User, {IUser} from '../models/user';
export default class UserService {
  // add user
  async addUser(userData: IUser) {
    try {
      const user = await User.findOne({
        email: userData.email,
      });
      if (user) {
        return {message: 'Email is already registered!'};
      }
      const hashPassword = await bcrypt.hash(userData.password, 10);
      userData.password = hashPassword;
      const data = await User.create(userData);
      const {password, ...newUser} = data.toJSON();
      password;
      return newUser;
    } catch (error) {
      return error as Error;
    }
  }

  // get all users
  async getAllUsers(hotelId: any) {
    try {
      const users = await User.find({hotel: hotelId, role: 'Employee'});
      return users;
    } catch (error) {
      return error as Error;
    }
  }
  // update user
  async updateUser(userId: any, userData: IUser) {
    try {
      if (userData.password) {
        const hashPassword = await bcrypt.hash(userData.password, 10);
        userData.password = hashPassword;
      }
      const user = await User.findByIdAndUpdate(userId,
        {$set: userData},
        {new: true});
      if (user == null) {
        return Error('The user is not found!');
      }
      return user;
    } catch (error) {
      return error as Error;
    }
  }
  // delete user
  async deleteUser(userId: any) {
    try {
      const user = await User.findById(userId);
      if (user?.role !== 'Owner') {
        await User.findByIdAndDelete(userId);
      } else {
        await User.findByIdAndDelete(userId);
        await Hotel.findByIdAndDelete(user?.hotel);
        await Room.deleteMany({hotel: user?.hotel});
        await RoomType.deleteMany({hotel: user?.hotel});
        await Transaction.deleteMany({hotel: user?.hotel});
      }
      if (user == null) {
        return Error('The user could not be found');
      }
    } catch (error) {
      return error as Error;
    }
  }
}
