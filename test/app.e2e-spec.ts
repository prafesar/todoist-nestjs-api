import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  let jwtToken: string;
  let userId: string;
  let server;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    server = await app.getHttpServer()
  })

  describe('AuthModule', () => {
    
    
    it('/auth/register (POST) with valid credentials', async () => {
      const response = await request(server)
        .post('/auth/register')
        .send({
          user: {
            email: 'test@example.com',
            password: 'password',
            login: 'tester',
          }
        })
        .expect(201)
    
    userId = response.body.user.id;
    expect(response.body.user.email).toBe('test@example.com');
    })

    it('/auth/login (POST) - succes and provides a jwt token', async (done) => {
      const response = await request(server)
        .post('/auth/login')
        .send({ email: 'test@example.com', password: 'password' })
        .expect(201)
      // set jwt token for use in subsequent tests
      jwtToken = response.body.user.token;
      userId = response.body.user.id;
      expect(response.body.user.token).toMatch(/^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/) // jwt regex
      done()
    })

    it('/auth/login (POST) - wrong pass -> unsucces', async (done) => {
      
      await request(server)
        .post('/auth/login')
        .send({ email: 'test@example.com', password: 'wrong' })
        .expect(401)
      done()
    })

  })

  // describe('ProjectModule', () => {
    
  //   it('/projects (GET) - no any projects', async (done) => {
  //     const response = await request(app.getHttpServer())
  //       .get('/projects')
  //       .set('Authorization', `Bearer ${jwtToken}`)
  //       .expect(404)
  //       // .then(({ body }: request.Response) => {
  //       //   expect(body).not.toBeDefined();
  //       //   done()
  //       // });
  //     expect(response.body.projects.length).toBe(0);
  //     done()
  //   });
    
  // })

  // describe('UserModule', () => {
  //   it('/users/:userId (DELETE) - unsucces', async () => {
  //     const response = await request(app.getHttpServer())
  //       .post(`/users/${userId}`)
  //       .set('Authorization', `Bearer ${jwtToken}`)
  //       .expect(204)

  //     expect(response.body).toEqual({})
  //   })
  // });

  afterAll(async () => {
    await Promise.all([
      app.close(),
    ])
  })

})
