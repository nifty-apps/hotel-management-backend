
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import config from '../config/';
import User, {IUser} from '../models/user';
export default class AuthService {
  //  Register  User
  async registration(userData: IUser) {
    try {
      const user = await User.findOne({
        $or: [{
          email: userData.email,
        }, {phone: userData.phone}],
      });
      if (user?.email == userData.email) {
        return Error('Email is already registered!');
      }
      const hashPassword = await bcrypt.hash(userData.password, 10);
      userData.password = hashPassword;
      const data = await User.create(userData);
      const token = jwt.sign(
        {id: data._id},
        config.authSecret,
        {
          expiresIn: '30d',
        });
      const {password, ...newUser} = data.toJSON();
      password;
      return {newUser, token};
    } catch (error) {
      return error as Error;
    }
  }
}
