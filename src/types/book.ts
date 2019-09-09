import { Document } from 'mongoose';

import { User } from './user';

export interface Book extends Document {
  owner: User;
  title: string;
  image: string;
  description: string;
  price: number;
  created: Date;
}
