import {Router} from 'express';
import DashboardService from '../../services/dashboard';
import checkLogin from '../common/checkLogin';
import {errorRes, successRes} from '../common/response';
const router = Router();

export default (app: Router) => {
  app.use('/dashboard', router);
  const dashboardService = new DashboardService();


  router.get('/info', checkLogin, async (req, res) => {
    try {
      const result = await dashboardService.getDashboardInfo(req.user);

      if (result instanceof Error) {
        return errorRes({res, message: result.message});
      }
      return successRes({res, data: result});
    } catch (error) {
      return errorRes({res, message: 'Server side error!'});
    }
  });
};
