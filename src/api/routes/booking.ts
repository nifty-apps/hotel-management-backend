import {Router} from 'express';
import Logger from '../../loaders/logger';
import BookingService from '../../services/booking';
import checkLogin from '../common/checkLogin';
import {errorRes, successRes} from '../common/response';


export default (app: Router) => {
  const router = Router({mergeParams: true});
  app.use('/rooms/bookings', router);
  const bookingService = new BookingService();

  router.post('/', checkLogin, async (req, res) => {
    try {
      const result = await bookingService.bookRoom({
        ...req.body,
        hotel: req.user.hotel,
      });

      if (result instanceof Error) {
        return errorRes({
          res, message: result.message,
          statusCode: 400,
        });
      }
      return successRes({
        res, message: 'The room has been successfully booked!',
        statusCode: 201,
      });
    } catch (e) {
      Logger.info(e);
      return errorRes({res, message: 'Internal server error!'});
    }
  });
  router.put('/:bookingId', checkLogin, async (req, res) => {
    try {
      const result = await bookingService.updateBookingInfo(
        req.body, req.params.bookingId);
      if (result instanceof Error) {
        return errorRes({
          res, message: result.message,
          statusCode: 400,
        });
      }
      return successRes({
        res, message: 'The booking information has been updated!',
        statusCode: 200,
        data: result,
      });
    } catch (e) {
      Logger.info(e);
      return errorRes({res, message: 'Internal server error!'});
    }
  });
};
