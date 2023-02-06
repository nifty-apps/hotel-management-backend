import {Router} from 'express';
import DashboardService from '../../services/dashboard';
import checkLogin from '../common/checkLogin';
import {errorRes, successRes} from '../common/response';


export default (app: Router) => {
  const router = Router({mergeParams: true});
  app.use('/dashboard/:hotelId/info', router);
  const dashboardService = new DashboardService();


  router.get('/', checkLogin, async (req, res) => {
    try {
      const result =
        await dashboardService.getDashboardInfo(req.params.hotelId);

      if (result instanceof Error) {
        return errorRes({res, message: result.message});
      }
      return successRes({res, data: result});
    } catch (error) {
      return errorRes({res, message: 'Server side error!'});
    }
  });
};
