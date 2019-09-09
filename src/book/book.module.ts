import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { BookSchema } from '../models/book.schema';
import { SharedModule } from '../shared/shared.module';
import { BookController } from './book.controller';
import { BookService } from './book.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Book', schema: BookSchema }]),
    SharedModule,
  ],
  providers: [BookService],
  controllers: [BookController],
})
export class BookModule {}
