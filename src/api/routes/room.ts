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
          errorMessage: error.message, statusCode: 403,
        });
      }
      const result = await roomService.addRoom({
        ...req.body,
        hotel: req.params.hotelId,
      });
      return successRes({
        res,
        message: 'Room created successfuly!',
        data: result,
      });
    } catch (error) {
      return errorRes({res, errorMessage: 'Server side error!'});
    }
  });
};
