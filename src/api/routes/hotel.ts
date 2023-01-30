import {Router} from 'express';
import HotelService from '../../services/hotel';
import checkLogin from '../common/checkLogin';
import {errorRes, successRes} from '../common/response';

const router = Router();
export default (app: Router) => {
  app.use('/hotel', router);

  const hotelService = new HotelService();

  router.post('/add', checkLogin, async (req, res) => {
    try {
      const result = await hotelService.addHotel(req.body, req.user._id);
      return successRes({res, data: result});
    } catch (error) {
      return errorRes({res, errorMessage: 'Serverside error!'});
    }
  });
};
