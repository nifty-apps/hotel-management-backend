import {Router} from 'express';
import AuthService from '../../services/auth';
import {errorRes, successRes} from '../common/response';
import authValidator from '../middlewares/validators/auth';
const router = Router();

export default (app: Router) => {
  app.use('/auth', router);
  const authService = new AuthService();
  router.post('/send-otp', async (req, res) => {
    try {
      const result = await authService.sendOTP(req.body.email);
      if (result instanceof Error) {
        return errorRes({res, message: result.message});
      }
      if (result.message) {
        return successRes({res, message: result.message, statusCode: 201});
      }
    } catch (error) {
      return errorRes({res: res, message: 'Internal server error!'});
    }
  });

  router.post('/verify-otp', async (req, res) => {
    try {
      const result = await authService.verifyOTP(req.body.email, req.body.otp);
      if (result instanceof Error) {
        return errorRes({res, message: result.message, statusCode: 401});
      }
      if (result.message) {
        return successRes({res, message: result.message, statusCode: 201});
      }
    } catch (error) {
      return errorRes({res: res, message: 'Internal server error!'});
    }
  });


  router.post('/registration', async (req, res) => {
    try {
      const error = authValidator.validateRegistration(req);
      if (error) {
        return errorRes({
          res,
          message: error.message,
          statusCode: 400,
        });
      };
      const result = await authService.registration(req.body);
      if (result instanceof Error) {
        return errorRes({res, message: result.message});
      }
      if (result.message) {
        return errorRes({res, message: result.message, statusCode: 403});
      }
      if (result.token) {
        res.setHeader('access-token', result.token);
      }

      return successRes({
        res, message: 'Account registered successfully',
        data: result,
        statusCode: 201,
      });
    } catch (error) {
      return errorRes({res: res, message: 'Internal server error!'});
    }
  });

  router.post('/login', async (req, res) => {
    try {
      const result = await authService.login(req.body);
      if (result instanceof Error) {
        return errorRes({res, message: result.message});
      };
      if (result.message) {
        return errorRes({res, message: result.message, statusCode: 403});
      }
      if (result.token) {
        res.setHeader('access-token', result.token);
      }


      return successRes({res, message: 'Login successfuly', data: result.data});
    } catch (error) {
      errorRes({res, message: 'Server side error!'});
    }
  });
  router.put('/update-password', async (req, res) => {
    try {
      const result =
        await authService.updatePassword(req.body.email, req.body.newPassword);
      if (result instanceof Error) {
        return errorRes({res, message: result.message});
      }
      return successRes({
        res, message: result.message,
        statusCode: 201,
      });
    } catch (error) {
      return errorRes({res: res, message: 'Internal server error!'});
    }
  });
};
