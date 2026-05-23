import { INestApplication } from '@nestjs/common';
import request, { Response } from 'supertest';
import * as bcrypt from 'bcrypt';
import { Server } from 'http';

import { PrismaService } from '../../../src/shared/infrastructure/prisma/prisma.service';
import { UserResponseDto } from '../../../src/modules/identity/infrastructure/dtos/auth.dto';
import { getTokensFromCookies } from '../helpers/cookie.helper';
import { adminEmailSeed, adminPassSeed } from '../../../prisma/seeders/admin.seed';
import { createTestApp } from '../app.e2e';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let server: Server;
  let prismaService: PrismaService;

  let accessCookie: string;
  let refreshCookie: string;

  beforeAll(async () => {
    app = await createTestApp();
    server = app.getHttpServer() as Server;

    prismaService = app.get(PrismaService);

    await prismaService.$connect();

    await prismaService.user.deleteMany();
    await prismaService.patient.deleteMany();
    await prismaService.doctor.deleteMany();

    const user = await prismaService.user.create({
      data: {
        email: adminEmailSeed,
        password: await bcrypt.hash(adminPassSeed, 10),
        role: 'admin',
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
  });

  afterAll(async () => {
    await prismaService.$disconnect();
    await app.close();
  });

  describe('/auth/login', () => {
    it('should login successfully', async () => {
      const response = await request(server)
        .post('/auth/login')
        .send({
          email: adminEmailSeed,
          password: adminPassSeed,
        })
        .expect(200);

      const body = response.body as UserResponseDto;
      expect(body.email).toBe(adminEmailSeed);

      const [access, refresh] = getTokensFromCookies(response);

      expect(access).toBeDefined();
      expect(refresh).toBeDefined();
      accessCookie = `accessToken=${access}`;
      refreshCookie = `refreshToken=${refresh}`;
    });

    it('should fail with invalid credentials', async () => {
      await request(server)
        .post('/auth/login')
        .send({
          email: adminEmailSeed,
          password: 'wrong-password',
        })
        .expect(401);
    });
  });

  describe('/auth/refresh', () => {
    it('should refresh session successfully', async () => {
      const response = await request(server)
        .post('/auth/refresh')
        .set('Cookie', refreshCookie)
        .expect(204);

      const [access, refresh] = getTokensFromCookies(response);
      expect(access).toBeDefined();
      expect(refresh).toBeDefined();
    });

    it('should fail without refresh token', async () => {
      await request(server).post('/auth/refresh').expect(401);
    });
  });

  describe('/auth/session', () => {
    it('should logout successfully', async () => {
      await request(server).delete('/auth/session').set('Cookie', accessCookie).expect(204);
    });

    it('should fail without access token', async () => {
      await request(server).delete('/auth/session').expect(401);
    });
  });
});
