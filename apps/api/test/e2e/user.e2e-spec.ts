import request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { Server } from 'http';
import cookieParser from 'cookie-parser';
import * as bcrypt from 'bcrypt';

import { createTestApp } from './app.e2e';
import { PrismaService } from '../../src/shared/infrastructure/prisma/prisma.service';
import { adminEmailSeed, adminPassSeed } from '../../prisma/seeders/admin.seed';
import { getTokensFromCookies } from './helpers/cookie.helper';

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

    // Seed admin user (igual que tu setup)
    const user = await prismaService.user.create({
      data: {
        email: 'admin@test.com',
        password: await bcrypt.hash('admin123', 10),
        role: 'doctor',
        documentNumber: '100000001',
        documentType: 'cc',
      },
    });

    await prismaService.doctor.create({
      data: {
        userId: user.id,
      },
    });

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

  it('should return users (happy path)', async () => {
    const res = await request(server)
      .get('/users?role=doctor|patient&limit=10&page=1')
      .set('Cookie', `accessToken=${accessToken}`);

    expect(res.status).toBe(200);

    expect(res.body).toEqual(
      expect.objectContaining({
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        data: expect.any(Array),
        page: 1,
        limit: 10,
        total: 1,
        hasNextPage: false,
      }),
    );
  });

  it('should return empty list when no users exist', async () => {
    const res = await request(server)
      .get('/users?role=patient&limit=10&page=1')
      .set('Cookie', `accessToken=${accessToken}`);

    expect(res.status).toBe(200);

    expect(res.body).toEqual({
      data: [],
      page: 1,
      limit: 10,
      total: 0,
      hasNextPage: false,
    });
  });
});
