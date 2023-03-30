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
}
