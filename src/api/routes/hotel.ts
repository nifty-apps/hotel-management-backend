import {Router} from 'express';
import HotelService from '../../services/hotel';
import checkLogin from '../common/checkLogin';
import {errorRes, successRes} from '../common/response';

const router = Router();
export default (app: Router) => {
  app.use('/hotels', router);

  const hotelService = new HotelService();

  router.post('/', checkLogin, async (req, res) => {
    try {
      const result = await hotelService.addHotel(req.body, req.user._id);
      if (result instanceof Error) {
        return errorRes({
          res,
          message: 'Hotel name is already exists !',
        });
      }
      return successRes({res, data: result});
    } catch (error) {
      return errorRes({res, message: 'Serverside error!'});
    }
  });
};
