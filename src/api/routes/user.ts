import {Router} from 'express';
import UserService from '../../services/user';
import checkLogin from '../common/checkLogin';
import {successRes} from '../common/response';
export default (app: Router) => {
  const router = Router();
  app.use('/users', router);

  const userService = new UserService();

  router.post('/', checkLogin, async (req, res) => {
    try {
      const result = await userService.addUser({
        ...req.body,
        hotel: req.user.hotel,
      });
      if (result instanceof Error) {
        return res.status(400).json({
          message: 'Server side error !',
        });
      }
      return successRes({
        res, message: 'The user has been added successfully!',
        data: result,
        statusCode: 201,
      });
    } catch (error) {

    }
  });

  router.get('/', checkLogin, async (req, res) => {
    try {
      const result = await userService.getAllUsers(req.user.hotel);
      if (result instanceof Error) {
        return res.status(400).json({
          message: 'Server side error !',
        });
      }
      return successRes({res, data: result, statusCode: 200});
    } catch (error) {
      return res.status(400).json({
        message: 'Server side error !',
      });
    }
  });

  router.put('/:userId', checkLogin, async (req, res) => {
    try {
      const result = await userService.updateUser(req.params.userId, req.body);
      if (result instanceof Error) {
        return res.status(400).json({
          message: 'Server side error !',
        });
      }
      return successRes({
        res, message: 'The user has been updated successfully!',
        data: result,
      });
    } catch (error) {
      return res.status(400).json({
        message: 'Server side error !',
      });
    }
  });

  router.delete('/:userId', checkLogin, async (req, res) => {
    try {
      const result = await userService.deleteUser(req.params.userId);
      if (result instanceof Error) {
        return res.status(400).json({
          message: 'Server side error !',
        });
      }
      return successRes({
        res, message: 'The user has been deleted successfully!',
        data: result,
      });
    } catch (error) {
      return res.status(400).json({
        message: 'Server side error !',
      });
    }
  });
};
