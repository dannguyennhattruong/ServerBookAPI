import { Document } from 'mongoose';

import { User } from './user';
import { Book } from './book';

interface bookOrder {
  book: Book;
  quantity: number;
}

export interface Order extends Document {
  owner: User;
  totalPrice: Number;
  books: bookOrder[];
  created: Date;
}
