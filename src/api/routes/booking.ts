import {Router} from 'express';
import BookingService from '../../services/booking';
import checkLogin from '../common/checkLogin';
import {errorRes, successRes} from '../common/response';
import bookingValidatior from '../middlewares/validators/booking';


export default (app: Router) => {
  const router = Router({mergeParams: true});
  app.use('/rooms/:roomId/bookings', router);
  const bookingService = new BookingService();

  router.post('/', checkLogin, async (req, res) => {
    try {
      const error = await bookingValidatior.validateBooking(req);
      if (error) {
        return errorRes({
          res,
          message: error.message,
          statusCode: 400,
        });
      }
      const result = await bookingService.bookRoom({
        ...req.body,
        room: req.params.roomId,
        hotel: req.user.hotel,
      });

      if (result instanceof Error) {
        return errorRes({
          res, message: result.message,
          statusCode: 400,
        });
      }
      return successRes({
        res, message: 'The room booked was successfuly!',
        statusCode: 201,
      });
    } catch (e) {
      return errorRes({res, message: 'Internal server error!'});
    }
  });
};
