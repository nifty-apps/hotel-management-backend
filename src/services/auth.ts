
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import config from '../config/';
import User, {IUser} from '../models/user';
export default class AuthService {
  //  Register  User
  async registration(userData: IUser) {
    try {
      const user = await User.findOne({
        email: userData.email,
      });
      if (user) {
        if (user?.email == userData.email) {
          return {message: 'Email is already registered!'};
        }
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

  async login(loginCredential: any) {
    try {
      const user = await User.findOne({
        email: loginCredential.email,
      }).select('+password');
      if (user) {
        const isValidPassword = await bcrypt.compare(
          loginCredential.password,
          user.password,
        );
        if (isValidPassword) {
          const token = jwt.sign({id: user._id}, config.authSecret, {
            expiresIn: '30d',
          });

          const {password, ...userData} = user.toJSON();
          password;
          return {userData, token};
        } else {
          return {message: 'Invalid password!'};
        }
      }
      return {message: 'User not found!'};
    } catch (error) {
      return error as Error;
    }
  }
}
