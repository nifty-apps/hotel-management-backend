import {Router} from 'express';
import Logger from '../../loaders/logger';
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

  // get recent booked rooms
  router.get('/recent/bookings', checkLogin, async (req, res) => {
    try {
      const result = await roomService.getRecentBookings(req.user.hotel);
      return successRes({res, data: result});
    } catch (e) {
      return errorRes({res, message: 'Server side error!'});
    }
  });

  // get today bookings
  router.get('/todays/booked', checkLogin, async (req, res) => {
    try {
      const result = await roomService.getTodayBooked(req.user.hotel);

      return successRes({res, data: result});
    } catch (e) {
      return errorRes({res, message: 'Server side error!'});
    }
  });
  // update room info
  router.put('/:roomId', checkLogin, async (req, res) => {
    try {
      const error = await roomValidator.validateRoom(req);
      if (error) {
        return errorRes({
          res,
          message: error.message, statusCode: 403,
        });
      }
      const result: any = await roomService.updateRoomInfo(req.body,
        req.params.roomId);
      if (result instanceof Error) {
        return errorRes({res, message: result.message, statusCode: 404});
      }
      if (result != null) {
        successRes({
          res,
          message: 'Room information update successfully!',
          data: result,
        });
      }
    } catch (e) {
      Logger.info(e);
      return errorRes({res, message: 'Server side error!'});
    }
  });

  // delete room
  router.delete('/:roomId', checkLogin, async (req, res) => {
    try {
      const result = await roomService.deleteRoom(req.params.roomId);
      if (result instanceof Error) {
        return errorRes({res, message: result.message, statusCode: 404});
      }
      successRes({
        res,
        message: 'The room has been deleted successfully!',
        data: result,
      });
    } catch (e) {

    }
  });
};
