import * as mongoose from 'mongoose';

export const OrderSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  totalPrice: {
    type: Number,
    default: 0,
  },
  books: [
    {
      book: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Book',
      },
      quantity: {
        type: Number,
        default: 1,
      },
    },
  ],
  created: {
    type: Date,
    default: Date.now,
  },
});
