import {NextFunction, Request, Response} from 'express';
import jwt, {JwtPayload} from 'jsonwebtoken';
import config from '../../config';
import Logger from '../../loaders/logger';
import User from '../../models/user';
import {errorRes} from './response';
export default async (req: Request, res: Response, next: NextFunction) => {
  if (req.headers.authorization) {
    try {
      // verify the token
      const token = req.headers.authorization.split(' ')[1];
      const payload = jwt.verify(token, config.authSecret) as
        JwtPayload;
      // attach user to the request
      const user = await User.findById(payload.id);
      Logger.info(user);
      if (!user) {
        return errorRes({
          res, message: 'Unauthorized Access',
          statusCode: 401,
        });
      }
      req.user = user;
      return next();
    } catch (error) {
      return errorRes({
        res, message: 'Unauthorized Access',
        statusCode: 401,
      });
    }
  } else {
    return errorRes({
      res, message: 'Unauthorized Access',
      statusCode: 401,
    });
  }
};
