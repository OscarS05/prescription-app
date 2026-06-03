import request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { Server } from 'http';
import { JwtService } from '@nestjs/jwt';

import { doctorEmailSeed, doctorPassSeed } from '../../../prisma/seeders/doctor.seed';
import { createTestApp } from '../app.e2e';
import { PrismaService } from '../../../src/shared/infrastructure/prisma/prisma.service';
import { adminEmailSeed, adminPassSeed } from '../../../prisma/seeders/admin.seed';
import { getTokensFromCookies } from '../helpers/cookie.helper';
import { runSeeds } from '../../../prisma/main.seed';
import { UserInfo } from '../../../src/modules/identity/domain/types/auth.types';
import { UserResponseDto } from '../../../src/modules/identity/infrastructure/dtos/auth.dto';
import { QueryResponse } from '../../../src/shared/infrastructure/dto/filters.dto';
import { AdminMetricsResponseDto } from '../../../src/modules/identity/infrastructure/dtos/user.dto';

describe('AdminController (e2e)', () => {
  let app: INestApplication;
  let server: Server;
  let prismaService: PrismaService;

  let accessToken: string;

  beforeAll(async () => {
    app = await createTestApp();
    server = app.getHttpServer() as Server;

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

  describe('GET /admin/users', () => {
    it('should return users (happy path)', async () => {
      const res = await request(server)
        .get('/admin/users?role=doctor|patient&limit=10&page=1')
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
        .get('/admin/users?role=patient&limit=10&page=1')
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

  describe('GET /admin/metrics', () => {
    it('should return metrics without query params', async () => {
      const res = await request(server)
        .get('/admin/metrics')
        .set('Cookie', `accessToken=${accessToken}`);

      expect(res.status).toBe(200);

      const body = res.body as AdminMetricsResponseDto;
      const hoy = new Date().toISOString().split('T')[0]; // to now

      expect(body).toMatchObject({
        period: {
          from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // from 30 days ago
          to: hoy,
        },
        totals: {
          doctors: 1,
          patients: 1,
          newPatients: 1,
          totalPrescriptions: 8,
          prescriptionsInPeriod: 8,
        },
        byStatus: {
          pending: 5,
          consumed: 3,
        },
        prescriptionsPerDay: [{ date: hoy, count: 8 }],
        topDoctors: [
          {
            doctorId: expect.any(String) as string,
            doctorEmail: doctorEmailSeed,
            prescriptions: 8,
          },
        ],
      });
    });

    it('should return metrics with query params', async () => {
      const from = new Date(Date.now() - 50 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split('T')[0];
      const hoy = new Date().toISOString().split('T')[0];

      const res = await request(server)
        .get(`/admin/metrics?from=${from}&to=${hoy}`)
        .set('Cookie', `accessToken=${accessToken}`);

      expect(res.status).toBe(200);

      const body = res.body as AdminMetricsResponseDto;

      expect(body.period).toEqual({ from, to: hoy });
      expect(body.totals).toBeDefined();
      expect(body.byStatus).toBeDefined();
      expect(body.prescriptionsPerDay).toBeDefined();
      expect(body.topDoctors).toBeDefined();
    });

    it('should fail with a role not allowed', async () => {
      const res = await request(server)
        .post('/auth/login')
        .send({ email: doctorEmailSeed, password: doctorPassSeed });
      const [accessTokenDoctor] = getTokensFromCookies(res);

      await request(server)
        .get(`/admin/metrics`)
        .set('Cookie', `accessToken=${accessTokenDoctor}`)
        .expect(403);
    });
  });

  describe('POST /admin/users', () => {
    it('should register user successfully', async () => {
      const response = await request(server)
        .post('/admin/users')
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
        .post('/admin/users')
        .set('Cookie', `accessToken=${invalidCookie}`)
        .send({
          email: doctorEmailSeed,
          password: doctorPassSeed,
        })
        .expect(403);
    });
  });
});
