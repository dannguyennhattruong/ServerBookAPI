import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Book } from '../types/book';
import { User } from '../types/user';
import { CreatebookDTO, UpdatebookDTO } from './book.dto';

@Injectable()
export class BookService {
  constructor(@InjectModel('Book') private bookModel: Model<Book>) {}

  async findAll(): Promise<Book[]> {
    return await this.bookModel.find().populate('owner');
  }

  async findByOwner(userId: string): Promise<Book[]> {
    return await this.bookModel.find({ owner: userId }).populate('owner');
  }

  async findById(id: string): Promise<Book> {
    const book = await this.bookModel.findById(id).populate('owner');
    if (!book) {
      throw new HttpException('book not found', HttpStatus.NO_CONTENT);
    }
    return book;
  }

  async create(bookDTO: CreatebookDTO, user: User): Promise<Book> {
    const book = await this.bookModel.create({
      ...bookDTO,
      owner: user,
    });
    await book.save();
    return book.populate('owner');
  }

  async update(
    id: string,
    bookDTO: UpdatebookDTO,
    userId: string,
  ): Promise<Book> {
    const book = await this.bookModel.findById(id);
    if (userId !== book.owner.toString()) {
      throw new HttpException(
        'You do not own this book',
        HttpStatus.UNAUTHORIZED,
      );
    }
    await book.update(bookDTO);
    return await this.bookModel.findById(id).populate('owner');
  }

  async delete(id: string, userId: string): Promise<Book> {
    const book = await this.bookModel.findById(id);
    if (userId !== book.owner.toString()) {
      throw new HttpException(
        'You do not own this book',
        HttpStatus.UNAUTHORIZED,
      );
    }
    await book.remove();
    return book.populate('owner');
  }
}
