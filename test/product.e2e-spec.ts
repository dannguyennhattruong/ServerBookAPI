import { HttpStatus } from '@nestjs/common';
import axios from 'axios';
import * as mongoose from 'mongoose';
import { RegisterDTO } from 'src/auth/auth.dto';
import { CreatebookDTO } from 'src/book/book.dto';
import * as request from 'supertest';
import { app, database } from './constants';

let userToken: string;
let bookuser: RegisterDTO = {
  userRole: true,
  username: 'bookuser',
  password: 'password',
};

beforeAll(async () => {
  await mongoose.connect(database);
  await mongoose.connection.db.dropDatabase();

  const {
    data: { token },
  } = await axios.post(`${app}/auth/register`, bookuser);

  userToken = token;
});

afterAll(async done => {
  await mongoose.disconnect(done);
});

describe('book', () => {
  const book: CreatebookDTO = {
    title: 'new phone',
    image: 'n/a',
    description: 'description',
    price: 10,
  };

  let bookId: string;

  it('should list all books', () => {
    return request(app)
      .get('/book')
      .expect(200);
  });

  it('should list my books', () => {
    return request(app)
      .get('/book/mine')
      .set('Authorization', `Bearer ${userToken}`)
      .expect(200);
  });

  it('should create book', () => {
    return request(app)
      .post('/book')
      .set('Authorization', `Bearer ${userToken}`)
      .set('Accept', 'application/json')
      .send(book)
      .expect(({ body }) => {
        expect(body._id).toBeDefined();
        bookId = body._id;
        expect(body.title).toEqual(book.title);
        expect(body.description).toEqual(book.description);
        expect(body.price).toEqual(book.price);
        expect(body.owner.username).toEqual(bookuser.username);
      })
      .expect(HttpStatus.CREATED);
  });

  it('should read book', () => {
    return request(app)
      .get(`/book/${bookId}`)
      .expect(({ body }) => {
        expect(body.title).toEqual(book.title);
        expect(body.description).toEqual(book.description);
        expect(body.price).toEqual(book.price);
        expect(body.owner.username).toEqual(bookuser.username);
      })
      .expect(200);
  });

  it('should update book', () => {
    return request(app)
      .put(`/book/${bookId}`)
      .set('Authorization', `Bearer ${userToken}`)
      .set('Accept', 'application/json')
      .send({
        title: 'newTitle',
      })
      .expect(({ body }) => {
        expect(body.title).not.toEqual(book.title);
        expect(body.description).toEqual(book.description);
        expect(body.price).toEqual(book.price);
        expect(body.owner.username).toEqual(bookuser.username);
      })
      .expect(200);
  });

  it('should delete book', async () => {
    await axios.delete(`${app}/book/${bookId}`, {
      headers: { Authorization: `Bearer ${userToken}` },
    });

    return request(app)
      .get(`/book/${bookId}`)
      .expect(HttpStatus.NO_CONTENT);
  });
});
