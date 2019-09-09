import axios from 'axios';
import * as mongoose from 'mongoose';
import { RegisterDTO } from 'src/auth/auth.dto';
import { CreatebookDTO } from 'src/book/book.dto';
import { Book } from 'src/types/book';
import * as request from 'supertest';
import { app, database } from './constants';

let userToken: string;
let buyerToken: string;
let boughtbooks: Book[];
const orderuser: RegisterDTO = {
  userRole: true,
  username: 'orderuser',
  password: 'password',
};
const orderBuyer: RegisterDTO = {
  userRole: false,
  username: 'orderBuyer',
  password: 'password',
};
const soldbooks: CreatebookDTO[] = [
  {
    title: 'newer phone',
    image: 'n/a',
    description: 'description',
    price: 10,
  },
  {
    title: 'newest phone',
    image: 'n/a',
    description: 'description',
    price: 20,
  },
];

beforeAll(async () => {
  await mongoose.connect(database);
  await mongoose.connection.db.dropDatabase();

  ({
    data: { token: userToken },
  } = await axios.post(`${app}/auth/register`, orderuser));
  ({
    data: { token: buyerToken },
  } = await axios.post(`${app}/auth/register`, orderBuyer));

  const [{ data: data1 }, { data: data2 }] = await Promise.all(
    soldbooks.map(book =>
      axios.post(`${app}/book`, book, {
        headers: { authorization: `Bearer ${userToken}` },
      }),
    ),
  );

  boughtbooks = [data1, data2];
});

afterAll(async done => {
  await mongoose.disconnect(done);
});

describe('ORDER', () => {
  it('should create order of all books', async () => {
    const orderDTO = {
      books: boughtbooks.map(book => ({
        book: book._id,
        quantity: 1,
      })),
    };

    return request(app)
      .post('/order')
      .set('Authorization', `Bearer ${buyerToken}`)
      .set('Accept', 'application/json')
      .send(orderDTO)
      .expect(({ body }) => {
        expect(body.owner.username).toEqual(orderBuyer.username);
        expect(body.books.length).toEqual(boughtbooks.length);
        expect(
          boughtbooks
            .map(book => book._id)
            .includes(body.books[0].book._id),
        ).toBeTruthy();
        expect(body.totalPrice).toEqual(
          boughtbooks.reduce((acc, i) => acc + i.price, 0),
        );
      })
      .expect(201);
  });

  it('should list all orders of buyer', () => {
    return request(app)
      .get('/order')
      .set('Authorization', `Bearer ${buyerToken}`)
      .expect(({ body }) => {
        expect(body.length).toEqual(1);
        expect(body[0].books.length).toEqual(boughtbooks.length);
        expect(
          boughtbooks
            .map(book => book._id)
            .includes(body[0].books[0].book._id),
        ).toBeTruthy();
        expect(body[0].totalPrice).toEqual(
          boughtbooks.reduce((acc, i) => acc + i.price, 0),
        );
      })
      .expect(200);
  });

  // what to use for payment? stripe?
  // it('should process order', () => {});
});
