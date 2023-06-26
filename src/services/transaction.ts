import {ObjectId} from 'mongoose';
import Booking from '../models/booking';
import Transaction, {ITransaction} from '../models/transaction';

export default class TransactionService {
  async createTransaction(transactionData: ITransaction) {
    try {
      // check if booking exists
      const booking = await Booking.findById(transactionData.booking);
      if (!booking) {
        throw new Error('Booking not found!');
      }
      const transactions =
        await Transaction.find({booking: transactionData.booking});

      // Total trasaction amount against this booking
      const totalAmount = transactions.reduce((sum, transaction) =>
        sum + transaction.amount, 0);
      const amount = booking?.total - booking?.discount;
      const payableAmount = amount - totalAmount;
      if (payableAmount < transactionData.amount) {
        return Error('Payable amount is ' + payableAmount);
      }
      const transaction = await Transaction.create(transactionData);
      if (payableAmount === transactionData.amount) {
        booking.paymentStatus = 'paid';
        await booking.save();
      }
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

  async getTransactionsByTimeRange(hotelId: ObjectId, timeRange: string) {
    const currentDate = new Date();
    let startDate: Date;

    switch (timeRange) {
      case 'week':
        startDate = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth(),
          currentDate.getDate() - currentDate.getDay(),
        );
        break;
      case 'month':
        startDate = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth(),
          1,
        );
        break;
      case 'year':
        startDate = new Date(
          currentDate.getFullYear(),
          0,
          1,
        );
        break;
      default:
        throw new Error('Invalid time range');
    }

    const transactions = await Transaction.aggregate([
      {
        $match: {
          hotel: hotelId,
          createdAt: {
            $gte: startDate,
            $lte: currentDate,
          },
        },
      },
      {
        $group: {
          _id: null,
          totalAmount: {$sum: '$amount'},
          transactions: {$push: '$$ROOT'},
        },
      },
      {
        $project: {
          _id: 0,
          totalAmount: 1,
          transactions: {
            $map: {
              input: '$transactions',
              as: 'transaction',
              in: {
                _id: '$$transaction._id',
                amount: '$$transaction.amount',
                paymentMethod: '$$transaction.paymentMethod',
                booking: '$$transaction.booking',
                createdAt: '$$transaction.createdAt',
              },
            },
          },
        },
      },
    ]);

    return transactions.length > 0 ? transactions[0] :
      {totalAmount: 0, transactions: []};
  }
  async getTransactionHistory(hotelId: ObjectId, timeRange: string) {
    try {
      const result = await this.getTransactionsByTimeRange(hotelId, timeRange);
      return result;
    } catch (error) {
      return error as Error;
    }
  }
}
