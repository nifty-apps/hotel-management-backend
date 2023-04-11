import {Router} from 'express';
import HotelService from '../../services/hotel';
import checkLogin from '../common/checkLogin';
import {errorRes, successRes} from '../common/response';
const mongoose = require('mongoose');

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
          message: 'Server side error !',
        });
      }
      return successRes({res, data: result});
    } catch (error) {
      return errorRes({res, message: 'Server side error!'});
    }
  });

  router.put('/:hotelId', checkLogin, async (req, res) => {
    try {
      const hotelId = req.params.hotelId;
      const objectId = mongoose.Types.ObjectId(hotelId);
      const result = await hotelService.updateHotelInfo(
        objectId, req.body);
      if (result instanceof Error) {
        return errorRes({
          res,
          message: 'Server side error !',
        });
      }
      return successRes({
        res, message: 'The hotel info successfuly updated!',
        data: result,
      });
    } catch (error) {
      return errorRes({res, message: 'Server side error!'});
    }
  });
};
