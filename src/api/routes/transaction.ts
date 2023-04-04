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
        return errorRes({res, message: 'Server side error!'});
      }
      return successRes({
        res, message: 'The payment has been successfully created!',
        data: result, statusCode: 201,
      });
    } catch (error) {
      return errorRes({res, message: 'Server side error!'});
    }
  });
  // get transaction list
  router.get('/:bookingId?', checkLogin, async (req, res) => {
    try {
      const result = await transactionService.
        getTransactionList(
          req.user.hotel,
          req.query.bookingId);
      if (result instanceof Error) {
        return errorRes({res, message: 'Server side error!'});
      }
      return successRes({res, data: result});
    } catch (error) {
      return errorRes({res, message: 'Server side error!'});
    }
  });
};
