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
  async getTransactionList(bookingId: any) {
    try {
      const transactions = await Transaction.
        find({booking: bookingId})
        .select('-__v -updatedAt -createdAt -hotel -booking');
      return transactions;
    } catch (error) {
      return error as Error;
    }
  }
}
