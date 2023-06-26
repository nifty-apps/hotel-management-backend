import {Router} from 'express';
import TransactionService from '../../services/transaction';
import checkLogin from '../common/checkLogin';
import {errorRes, successRes} from '../common/response';

export default (app: Router) => {
  const router = Router();
  app.use('/transactions', router);
  const transactionService = new TransactionService();
  // create transaction
  router.post('/:bookinId', checkLogin, async (req, res) => {
    try {
      const result = await transactionService.createTransaction({
        ...req.body,
        booking: req.params.bookinId,
        hotel: req.user.hotel,
      });
      if (result instanceof Error) {
        return errorRes({res, message: result.message, statusCode: 403});
      }
      return successRes({
        res, message: 'The payment has been successfully created!',
        data: result, statusCode: 201,
      });
    } catch (error) {
      return errorRes({res, message: 'Server side error!'});
    }
  });
  // get transaction list by time range
  router.get('/history', checkLogin, async (req, res) => {
    try {
      const timeRange = req.query.timeRange;

      if (!timeRange) {
        return errorRes({res, message: 'Time range is required!'});
      }
      const result = await transactionService.
        getTransactionHistory(
          req.user.hotel,
          timeRange as string,
        );
      if (result instanceof Error) {
        return errorRes({res, message: 'Server side error!'});
      }
      return successRes({res, data: result});
    } catch (error) {
      return errorRes({res, message: 'Server side error!'});
    }
  });
  // get transaction list
  router.get('/:bookingId?', checkLogin, async (req, res) => {
    try {
      const fromDate = req.query.fromDate as string;
      const toDate = req.query.toDate as string;
      const result = await transactionService.
        getTransactionList(
          req.user.hotel,
          req.query.bookingId,
          fromDate,
          toDate,
        );
      if (result instanceof Error) {
        return errorRes({res, message: 'Server side error!'});
      }
      return successRes({res, data: result});
    } catch (error) {
      return errorRes({res, message: 'Server side error!'});
    }
  });
};
