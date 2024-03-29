import {Router} from 'express';
import Logger from '../../loaders/logger';
import RoomService from '../../services/room';
import checkLogin from '../common/checkLogin';
import {errorRes, successRes} from '../common/response';
import roomValidator from '../middlewares/validators/room';


export default (app: Router) => {
  const router = Router();
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
        roomType: req.body.roomType,
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


  // get available rooms
  router.get('/available', checkLogin, async (req, res) => {
    try {
      const fromDate = req.query.fromDate as string;
      const toDate = req.query.toDate as string;
      const result = await roomService.getAvailableRooms(
        fromDate, toDate, req.user.hotel);
      return successRes({res, data: result});
    } catch (e) {
      return errorRes({res, message: 'Server side error!'});
    }
  });
  // get available room check
  router.get('/available/check', checkLogin, async (req, res) => {
    try {
      const checkoutDate = req.query.checkoutDate as string;
      const extendsCheckoutDate = req.query.extendsCheckoutDate as string;
      const result = await roomService.checkRoomIsAvailable(
        checkoutDate,
        extendsCheckoutDate,
        req.user.hotel,
        req.query.roomIds as string[],
      );
      if (Array.isArray(result)) {
        return successRes({res, data: result});
      } else if (result instanceof Error) {
        return errorRes({res, message: 'Server side error!'});
      } else {
        return errorRes({
          res, message: result.message,
          statusCode: result.statusCode,
        });
      }
    } catch (e) {
      return errorRes({res, message: 'Server side error!'});
    }
  });

  // get total rooms
  router.get('/:roomNumber?', checkLogin, async (req, res) => {
    try {
      const roomNumber: string = req.query.roomNumber as string;
      const result = await roomService.getTotalRooms(
        req.user.hotel, roomNumber);
      return successRes({res, data: result});
    } catch (e) {
      return errorRes({res, message: 'Server side error!'});
    }
  });


  // get today bookings
  router.get('/todays/bookings', checkLogin, async (req, res) => {
    try {
      const result = await roomService.getTodayBooked(req.user.hotel);

      return successRes({res, data: result});
    } catch (e) {
      return errorRes({res, message: 'Server side error!'});
    }
  });

  // get rooms report
  router.get('/bookings/report', checkLogin, async (req, res) => {
    try {
      const result = await roomService.getRoomsReport(req.user.hotel);
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
      const result: any = await roomService.updateRoomInfo(
        req.body,
        req.params.roomId,
      );
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
