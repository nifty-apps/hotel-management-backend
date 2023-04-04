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
        data: {_id: result},
        statusCode: 201,
      });
    } catch (e) {
      Logger.info(e);
      return errorRes({res, message: 'Internal server error!'});
    }
  });
  // get bookings details
  router.get('/details/:bookingId', checkLogin, async (req, res) => {
    try {
      const result = await bookingService.getBookingInfo(req.params.bookingId);
      if (result instanceof Error) {
        return errorRes({
          res, message: result.message,
          statusCode: 400,
        });
      }
      if (result != null) {
        return successRes({res, data: result});
      }
    } catch (e) {
      return errorRes({res, message: 'Server side error!'});
    }
  });

  // get recent booked rooms
  router.get('/recent', checkLogin, async (req, res) => {
    try {
      const result = await bookingService.getRecentBookings(req.user.hotel);
      return successRes({res, data: result});
    } catch (e) {
      return errorRes({res, message: 'Server side error!'});
    }
  });
  // get checkin list
  router.get('/checkin', checkLogin, async (req, res) => {
    try {
      const checkInDate = req.query.checkInDate as string;
      const checkOutDate = req.query.checkOutDate as string;
      const status = req.query.status as string;
      const result = await bookingService.getBookingsList(
        req.user.hotel,
        checkInDate,
        checkOutDate,
        status,
      );
      return successRes({res, data: result});
    } catch (error) {
      return errorRes({res, message: 'Server side error!'});
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
