import { HttpStatus } from '@nestjs/common';
import 'dotenv/config';
import * as mongoose from 'mongoose';
import * as request from 'supertest';
import { LoginDTO, RegisterDTO } from '../src/auth/auth.dto';
import { app, database } from './constants';

beforeAll(async () => {
  await mongoose.connect(database);
  await mongoose.connection.db.dropDatabase();
});

afterAll(async done => {
  await mongoose.disconnect(done);
});

describe('AUTH', () => {
  const user: RegisterDTO = {
    username: 'username',
    password: 'password',
  };

  const userRegister: RegisterDTO = {
    username: 'user',
    password: 'password',
    userRole: true,
  };

  const userLogin: LoginDTO = {
    username: 'user',
    password: 'password',
  };

  let userToken: string;

  it('should register user', () => {
    return request(app)
      .post('/auth/register')
      .set('Accept', 'application/json')
      .send(user)
      .expect(({ body }) => {
        expect(body.token).toBeDefined();
        expect(body.user.username).toEqual('username');
        expect(body.user.password).toBeUndefined();
        expect(body.user.user).toBeFalsy();
      })
      .expect(HttpStatus.CREATED);
  });

  it('should register user', () => {
    return request(app)
      .post('/auth/register')
      .set('Accept', 'application/json')
      .send(userRegister)
      .expect(({ body }) => {
        expect(body.token).toBeDefined();
        expect(body.user.username).toEqual('user');
        expect(body.user.password).toBeUndefined();
        expect(body.user.user).toBeTruthy();
      })
      .expect(HttpStatus.CREATED);
  });

  it('should reject duplicate registration', () => {
    return request(app)
      .post('/auth/register')
      .set('Accept', 'application/json')
      .send(user)
      .expect(({ body }) => {
        expect(body.message).toEqual('User already exists');
      })
      .expect(HttpStatus.BAD_REQUEST);
  });

  it('should login user', () => {
    return request(app)
      .post('/auth/login')
      .set('Accept', 'application/json')
      .send(user)
      .expect(({ body }) => {
        userToken = body.token;

        expect(body.token).toBeDefined();
        expect(body.user.username).toEqual('username');
        expect(body.user.password).toBeUndefined();
      })
      .expect(HttpStatus.CREATED);
  });

  it('should login user', () => {
    return request(app)
      .post('/auth/login')
      .set('Accept', 'application/json')
      .send(userLogin)
      .expect(({ body }) => {
        userToken = body.token;

        expect(body.token).toBeDefined();
        expect(body.user.username).toEqual('user');
        expect(body.user.password).toBeUndefined();
        expect(body.user.user).toBeTruthy();
      });
  });

  it('should respect user token', () => {
    return request(app)
      .get('/book/mine')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${userToken}`)
      .expect(200);
  });
});
