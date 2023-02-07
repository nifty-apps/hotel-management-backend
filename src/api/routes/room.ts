import {Router} from 'express';
import RoomService from '../../services/room';
import checkLogin from '../common/checkLogin';
import {errorRes, successRes} from '../common/response';
import roomValidator from '../middlewares/validators/room';

export default (app: Router) => {
  const router = Router({mergeParams: true});
  app.use('/rooms', router);

  const roomService = new RoomService();

  // add room
  router.post('/', checkLogin, async (req, res) => {
    try {
      const error = await roomValidator.validateRoom(req);
      if (error) {
        return errorRes({
          res,
          message: error.message, statusCode: 403,
        });
      }
      const result: any = await roomService.addRoom({
        ...req.body,
        hotel: req.user.hotel,
      });
      if (result instanceof Error) {
        return errorRes({res, message: result.message});
      };
      if (result.message) {
        return errorRes({res, message: result.message, statusCode: 409});
      }
      return successRes({
        res,
        message: 'The room was created successfully!',
        data: result,
        statusCode: 201,
      });
    } catch (error) {
      return errorRes({res, message: 'Server side error!'});
    }
  });

  // get total rooms
  router.get('/', checkLogin, async (req, res) => {
    try {
      const result = await roomService.getTotalRooms(req.user.hotel);
      return successRes({res, data: result});
    } catch (e) {
      return errorRes({res, message: 'Server side error!'});
    }
  });
};
