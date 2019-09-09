import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { UserGuard } from '../guards/user.guard';
import { Book } from '../types/book';
import { User as UserDocument } from '../types/user';
import { Users } from '../utilities/user.decorator';
import { CreatebookDTO, UpdatebookDTO } from './book.dto';
import { BookService } from './book.service';

@Controller('book')
export class BookController {
  constructor(private bookService: BookService) {}

  @Get()
  @UseGuards(AuthGuard('jwt'),UseGuards)
  async listAll(): Promise<Book[]> {
    return await this.bookService.findAll();
  }

  @Get('/mine')
  @UseGuards(AuthGuard('jwt'), UseGuards)
  async listMine(@Users() user: UserDocument): Promise<Book[]> {
    const { id } = user;
    return await this.bookService.findByOwner(id);
  }

  @Get('/user/:id')
  async listByUser(@Param('id') id: string): Promise<Book[]> {
    return await this.bookService.findByOwner(id);
  }

  @Post()
  @UseGuards(AuthGuard('jwt'), UserGuard)
  async create(
    @Body() book: CreatebookDTO,
    @Users() user: UserDocument,
  ): Promise<Book> {
    return await this.bookService.create(book, user);
  }

  @Get('/:id')
  async read(@Param('id') id: string): Promise<Book> {
    const book = this.bookService.findById(id);
    if(!book) console.log('not exist')
    else return book;
  }

  @Put('/:id')
  @UseGuards(AuthGuard('jwt'), UserGuard)
  async update(
    @Param('id') id: string,
    @Body() book: UpdatebookDTO,
    @Users() user: UserDocument,
  ): Promise<Book> {
    const { id: userId } = user;
    return await this.bookService.update(id, book, userId);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), UserGuard)
  async delete(
    @Param('id') id: string,
    @Users() user: UserDocument,
  ): Promise<Book> {
    const { id: userId } = user;
    return await this.bookService.delete(id, userId);
  }
}
