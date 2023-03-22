import {Router} from 'express';
import RoomTypeService from '../../services/room_type';
import checkLogin from '../common/checkLogin';
import {errorRes, successRes} from '../common/response';

export default (app: Router) => {
  const router = Router();
  app.use('/room/type', router);
  const roomTypeService = new RoomTypeService();

  router.post('/', checkLogin, async (req, res) => {
    try {
      const result = await roomTypeService.addRoomType({
        ...req.body,
        hotel: req.user.hotel,
      });
      if (result instanceof Error) {
        return errorRes({
          res,
          message: 'Server side error!',
        });
      }
      return successRes({
        res,
        message: 'The room type has been added successfully',
      });
    } catch (error) {
      return errorRes({
        res,
        message: 'Server side error!',
      });
    }
  });

  router.get('/', checkLogin, async (req, res) => {
    try {
      const result = await roomTypeService.getRoomTypeList(req.user.hotel);
      if (result instanceof Error) {
        return errorRes({
          res,
          message: 'Server side error!',
        });
      }
      return successRes({
        res,
        data: result,
      });
    } catch (error) {
      return errorRes({
        res,
        message: 'Server side error!',
      });
    }
  });
  router.put('/:id', checkLogin, async (req, res) => {
    try {
      const result = await roomTypeService.updateRoomType(
        req.body, req.params.id);
      if (result instanceof Error) {
        errorRes({
          res,
          message: 'Server side error!',
        });
      }
      return successRes({
        res,
        message: 'The room type has been updated successfully',
      });
    } catch (error) {
      return errorRes({
        res,
        message: 'Server side error!',
      });
    }
  });
  router.delete('/:id', checkLogin, async (req, res) => {
    try {
      const result = await roomTypeService.deleteRoomType(req.params.id);
      if (result instanceof Error) {
        return errorRes({res, message: 'Server side error!'});
      }
      return successRes({
        res,
        message: 'The room type has been deleted successfully',
      });
    } catch (error) {
      return errorRes({res, message: 'Server side error!'});
    }
  });
};
