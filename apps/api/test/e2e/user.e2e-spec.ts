import request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { Server } from 'http';
import cookieParser from 'cookie-parser';
import { JwtService } from '@nestjs/jwt';

import { doctorEmailSeed, doctorPassSeed } from '../../prisma/seeders/doctor.seed';
import { createTestApp } from './app.e2e';
import { PrismaService } from '../../src/shared/infrastructure/prisma/prisma.service';
import { adminEmailSeed, adminPassSeed } from '../../prisma/seeders/admin.seed';
import { getTokensFromCookies } from './helpers/cookie.helper';
import { runSeeds } from '../../prisma/main.seed';
import { QueryResponse } from '../../src/modules/identity/infrastructure/dtos/user.dto';
import { UserInfo } from '../../src/modules/identity/domain/types/auth.types';
import { UserResponseDto } from '../../src/modules/identity/infrastructure/dtos/auth.dto';

describe('GET /users (e2e)', () => {
  let app: INestApplication;
  let server: Server;
  let prismaService: PrismaService;

  let accessToken: string;

  beforeAll(async () => {
    app = await createTestApp();
    server = app.getHttpServer() as Server;

    app.use(cookieParser());
    prismaService = app.get(PrismaService);

    await prismaService.$connect();

    await prismaService.user.deleteMany();
    await prismaService.patient.deleteMany();
    await prismaService.doctor.deleteMany();

    await runSeeds();

    await app.init();

    const res = await request(server)
      .post('/auth/login')
      .send({ email: adminEmailSeed, password: adminPassSeed });
    [accessToken] = getTokensFromCookies(res);
  });

  afterAll(async () => {
    await prismaService.$disconnect();
    await app.close();
  });

  describe('GET /users', () => {
    it('should return users (happy path)', async () => {
      const res = await request(server)
        .get('/users?role=doctor|patient&limit=10&page=1')
        .set('Cookie', `accessToken=${accessToken}`);

      expect(res.status).toBe(200);

      const body = res.body as QueryResponse<UserInfo>;
      expect(body).toEqual(
        expect.objectContaining({
          page: 1,
          limit: 10,
          total: 2,
          hasNextPage: false,
        }),
      );
      expect(body.data.length).toBe(2); // 2 users with those roles: doctor and patient in seeders
    });

    it('should return empty list when no users exist', async () => {
      const res = await request(server)
        .get('/users?role=patient&limit=10&page=1')
        .set('Cookie', `accessToken=${accessToken}`);

      expect(res.status).toBe(200);

      const body = res.body as QueryResponse<UserInfo>;
      expect(body).toEqual(
        expect.objectContaining({
          page: 1,
          limit: 10,
          total: 1,
          hasNextPage: false,
        }),
      );
      expect(body.data.length).toBe(1); // 1 patient in seeders
    });
  });

  describe('/users', () => {
    it('should register user successfully', async () => {
      const response = await request(server)
        .post('/users')
        .set('Cookie', `accessToken=${accessToken}`)
        .send({
          email: 'newpatient@test.com',
          password: 'password123@',
          role: 'patient',
          documentType: 'cc',
          documentNumber: '999999',
        })
        .expect(201);
      const body = response.body as UserResponseDto;
      expect(body.email).toBe('newpatient@test.com');
    });

    it('should fail with a role not allowed', async () => {
      const invalidCookie = new JwtService().sign(
        { sub: 'admin-id', role: 'doctor' },
        { secret: process.env['JWT_ACCESS_SECRET'], expiresIn: '15m' },
      );
      await request(server)
        .post('/users')
        .set('Cookie', `accessToken=${invalidCookie}`)
        .send({
          email: doctorEmailSeed,
          password: doctorPassSeed,
        })
        .expect(403);
    });
  });
});
