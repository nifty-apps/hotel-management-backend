import {Router} from 'express';
import AuthService from '../../services/auth';
import {errorRes, successRes} from '../common/response';
import authValidator from '../middlewares/validators/auth';
const router = Router();

export default (app: Router) => {
  app.use('/auth', router);
  const authService = new AuthService();

  router.post('/registration', async (req, res) => {
    try {
      const error = authValidator.validateRegistration(req);
      if (error) {
        return errorRes({
          res,
          errorMessage: error.message,
          statusCode: 400,
        });
      };
      const result = await authService.registration(req.body);
      if (result instanceof Error) {
        return errorRes({res, errorMessage: result.message});
      }
      res.setHeader('access-token', result.token);
      return successRes({
        res, message: 'Regiration successfuly!',
        data: result,
      });
    } catch (error) {
      return errorRes({res: res, errorMessage: 'Internal server error!'});
    }
  });

  router.post('/login', async (req, res) => {
    try {

    } catch (error) {

    }
  });
};
