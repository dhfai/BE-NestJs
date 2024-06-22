import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { Logger } from 'winston';
import { TestSErvice } from './test.service';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { TestModule } from './test.module';
import { register } from 'module';

describe('UserController', () => {
  let app: INestApplication;
  let logger: Logger;
  let testService: TestSErvice

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, TestModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    logger = app.get(WINSTON_MODULE_PROVIDER);
    testService = app.get(TestSErvice);
  });

  describe('POST /api/users', () => {
    beforeEach(async () => {
      await testService.deleteUser();
    })
    it('should be rejected if request is invalid', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/users')
        .send({
          username: '',
          password: '',
          name: '',
        });
      
      logger.info(response.body);
      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
    });
    
    it('should be abble to register', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/users')
        .send({
          username: 'tes',
          password: 'tes',
          name: 'tes',
        });
      
      logger.info(response.body);
      
      expect(response.status).toBe(200);
      expect(response.body.data.username).toBe('tes');
      expect(response.body.data.name).toBe('tes');

    });
    
    it('should be rejected if username already exists', async () => {
      await testService.createUser();
      const response = await request(app.getHttpServer())
        .post('/api/users')
        .send({
          username: 'tes',
          password: 'tes',
          name: 'tes',
        });

      logger.info(response.body);
      expect(response.status).toBe(400);
      expect(response.body.data.name).toBeDefined()
    });
  });
  
  
  describe('POST /api/users/login', () => {
    beforeEach(async () => {
      await testService.deleteUser();
      await testService.createUser();
    })

    it('should be rejected if request is invalid', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/users/login')
        .send({
          username: '',
          password: '',
        });
      
      logger.info(response.body);
      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
    });
    
    it('should be abble to login', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/users/login')
        .send({
          username: 'tes',
          password: 'tes',
        });
      
      logger.info(response.body);
      
      expect(response.status).toBe(200);
      expect(response.body.data.username).toBe('tes');
      expect(response.body.data.name).toBe('tes');
      expect(response.body.data.token).toBeDefined();
    });
  });

  describe('GET /api/users/current', () => {
    beforeEach(async () => {
      await testService.deleteUser();
      await testService.createUser();
    })

    it('should be rejected if token request is invalid', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/users/current')
        .set('Authorization', 'wrong')
      
      logger.info(response.body);
      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
    });
    
    it('should be abble to get users', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/users/current')
        .set('Authorization', 'tes')
      
      logger.info(response.body);
      
      expect(response.status).toBe(200);
      expect(response.body.data.username).toBe('tes');
      expect(response.body.data.name).toBe('tes');
    });
  });
});
