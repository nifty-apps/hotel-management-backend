import Transaction, {ITransaction} from '../models/transaction';

export default class TransactionService {
  async createTransaction(transactionData: ITransaction) {
    try {
      const transaction = await Transaction.create(transactionData);
      return transaction;
    } catch (e) {
      return e as Error;
    }
  }
  async getTransactionList(hotelId: any, bookingId?: any,
    fromDate?: string, toDate?: string) {
    try {
      const filter: any = {hotel: hotelId};
      if (bookingId) {
        filter['booking'] = bookingId;
      }
      if (fromDate && toDate) {
        const fromDateObj = new Date(fromDate);
        const toDateObj = new Date(toDate);
        if (isNaN(fromDateObj.getTime()) || isNaN(toDateObj.getTime())) {
          throw new Error('Invalid date format');
        }
        filter['createdAt'] = {
          $gte: fromDateObj,
          $lte: toDateObj,
        };
      }
      const transactions = await Transaction.find(filter)
        .populate({path: 'booking', select: 'customer.name customer.phone'}).
        select('_id amount paymentMethod ');
      return transactions;
    } catch (e) {
      return e as Error;
    }
  }
}
