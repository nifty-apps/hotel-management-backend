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
  async getTransactionList(hotelId: any, bookingId?: any) {
    try {
      const filter: {hotel: any, number?: any}
      & {booking?: any} = {hotel: hotelId};
      if (bookingId) {
        filter['booking'] = bookingId;
      }
      const transactions = await Transaction.find(filter).
        select('-__v -hotel -booking -createdAt -updatedAt');
      return transactions;
    } catch (e) {
      return e as Error;
    }
  }
}
