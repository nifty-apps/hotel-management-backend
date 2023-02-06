import {Router} from 'express';
import RoomService from '../../services/room';
import checkLogin from '../common/checkLogin';
import {errorRes, successRes} from '../common/response';
import roomValidator from '../middlewares/validators/room';

export default (app: Router) => {
  const router = Router({mergeParams: true});
  app.use('/hotels/:hotelId/rooms', router);

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
        hotel: req.params.hotelId,
      });
      if (result instanceof Error) {
        return errorRes({res, message: result.message});
      };
      if (result.message) {
        return errorRes({res, message: result.message, statusCode: 409});
      }
      return successRes({
        res,
        message: 'Room created successfuly!',
        data: result,
      });
    } catch (error) {
      return errorRes({res, message: 'Server side error!'});
    }
  });
};
