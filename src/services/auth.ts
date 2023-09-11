
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import nodeMailer from 'nodemailer';
import config from '../config/';
import OTP from '../models/otp';
import User, {IUser} from '../models/user';
export default class AuthService {
  // Send OTP
  async sendOTP(email: string) {
    try {
      await OTP.findOneAndDelete({email});
      const otp = Math.floor(100000 + Math.random() * 900000);
      await OTP.create({email, otp});
      const transporter = nodeMailer.createTransport({
        host: config.smtpHost,
        port: config.smtpPort,
        auth: {
          user: config.smtpUser,
          pass: config.smtpPass,
        },
      });
      const emailInfo = await transporter.sendMail({
        from: 'Booking Dei <noreply@bookingdei.com>',
        to: email,
        subject: 'OTP for email verification',
        text: `Your OTP for email verification is ${otp}`,
      });
      if (emailInfo.accepted && emailInfo.accepted.length > 0) {
        return {message: 'OTP sent successfully!'};
      }
      throw new Error('Failed to send OTP');
    } catch (error) {
      return error as Error;
    }
  }
  // verify OTP
  async verifyOTP(email: string, code: number) {
    try {
      const otp = await OTP.findOneAndDelete({'email': email, 'otp': code});
      if (!otp) {
        return Error('Invalid OTP!');
      }
      return {message: 'OTP verified successfully!'};
    } catch (error) {
      return error as Error;
    }
  }

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
// this is login
  async login(loginCredential: any) {
    try {
      const user = await User.findOne({
        email: loginCredential.email,
      }).select('+password').populate('hotel');
      if (user) {
        const isValidPassword = await bcrypt.compare(
          loginCredential.password,
          user.password,
        );
        if (isValidPassword) {
          const token = jwt.sign({id: user._id}, config.authSecret, {
            expiresIn: '30d',
          });

          const {password, ...data} = user.toJSON();
          password;
          return {data, token};
        } else {
          return {message: 'Invalid password!'};
        }
      }
      return {message: 'User not found!'};
    } catch (error) {
      return error as Error;
    }
  }

  async updatePassword(email: string, newPassword: string) {
    try {
      const user = await User.findOne({email});
      if (!user) {
        return {message: 'User not found!'};
      }
      const hashPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashPassword;
      await user.save();
      return {message: 'Password updated successfully!'};
    } catch (error) {
      return error as Error;
    }
  }
}
