import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { UserRole } from '../src/common/enums/user-role.enum';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  let adminJwtToken: string;
  let adminId: string;
  let userJwtToken: string;
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
    
    
    it('/auth/register (POST) create first user (ADMIN)', async () => {
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
    
    const { id, role, email } = response.body.user;
    adminId = id;
    expect(role).toBe(UserRole.ADMIN)
    expect(email).toBe('test@example.com');
    })

    it('/auth/register (POST) create other user with role User', async () => {
      const response = await request(server)
        .post('/auth/register')
        .send({
          user: {
            email: 'user@example.com',
            password: '1234',
            login: 'user2',
          }
        })
        .expect(201)
    
    const { id, role, email } = response.body.user;
    userId = id;
    expect(role).toBe(UserRole.USER)
    expect(email).toBe('user@example.com');
    })

    it('/auth/login (POST) - succes auth Admin and provides a jwt token', async (done) => {
      const response = await request(server)
        .post('/auth/login')
        .send({ email: 'test@example.com', password: 'password' })
        .expect(201)
      // set jwt token for use in subsequent tests
      const { token } = response.body.user;
      adminJwtToken = token;
      expect(token).toMatch(/^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/) // jwt regex
      done()
    })

    it('/auth/login (POST) - succes auth User and provides a jwt token', async (done) => {
      const response = await request(server)
        .post('/auth/login')
        .send({ email: 'user@example.com', password: '1234' })
        .expect(201)
      // set jwt token for use in subsequent tests
      const { token } = response.body.user;
      userJwtToken = token;
      expect(token).toMatch(/^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/) // jwt regex
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

  describe('ProjectModule', () => {
    
    it('/projects (GET) - no any projects', async (done) => {
      const response = await request(app.getHttpServer())
        .get('/projects')
        .set('Authorization', `Bearer ${userJwtToken}`)
        .expect(200);
      
      expect(response.body.projects.length).toBe(0);
      done()
    });

    it.todo('/projects (POST) - create project by User -- unsuccess');
    it.todo('/projects (POST) - create project by Admin -- success');
    it.todo('/projects (GEY) - get list of projects -- success');
    it.todo('/projects/:projectId (GET) - get project by Id -- unsuccess');

    
  })

  describe('UserModule', () => {
    it('/users/:userId (GET) - succes', async () => {
      await request(app.getHttpServer())
        .get(`/users/${adminId}`)
        .set('Authorization', `Bearer ${adminJwtToken}`)
        .expect(200)
        .then(({ body }) => {
          const { user: { email } } = body;
          expect(email).toBe('test@example.com');
        });
    });

  });

  describe('Delete Test', () => {
    it('/users/:userId (DELETE) - succes', async () => {
      const response = await request(app.getHttpServer())
        .delete(`/users/${adminId}`)
        .set('Authorization', `Bearer ${adminJwtToken}`)
        .expect(204)

      expect(response.body).toEqual({})
    })

    it.todo('/projects/:projectId (DELETE) - delete project by User -- unsuccess');
    it.todo('/projects/:projectId (DELETE) - delete project by Admin -- success');
    
  })

  afterAll(async () => {
    await Promise.all([
      app.close(),
    ])
  })

})
