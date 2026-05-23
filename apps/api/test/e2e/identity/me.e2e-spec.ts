import { INestApplication } from '@nestjs/common';
import { Server } from 'http';
import request, { Response } from 'supertest';

import { createTestApp } from '../app.e2e';
import { PrismaService } from '../../../src/shared/infrastructure/prisma/prisma.service';
import { runSeeds } from '../../../prisma/main.seed';
import { getTokensFromCookies } from '../helpers/cookie.helper';
import { UserResponseDto } from '../../../src/modules/identity/infrastructure/dtos/auth.dto';
import { doctorEmailSeed, doctorPassSeed } from '../../../prisma/seeders/doctor.seed';

describe('MeController (e2e)', () => {
  let app: INestApplication;
  let server: Server;
  let prismaService: PrismaService;

  let accessToken: string;
  let accessCookie: string;

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

    // Doctor account
    const res = await request(server)
      .post('/auth/login')
      .send({ email: doctorEmailSeed, password: doctorPassSeed });
    [accessToken] = getTokensFromCookies(res);
    accessCookie = `accessToken=${accessToken}`;
  });

  afterAll(async () => {
    await prismaService.$disconnect();
    await app.close();
  });

  describe('/me/profile', () => {
    it('should get current user profile', async () => {
      const response = await request(server)
        .get('/me/profile')
        .set('Cookie', accessCookie)
        .expect(200);

      const body = response.body as UserResponseDto;
      expect(body.email).toBe(doctorEmailSeed);
      expect(body.doctor).toBeDefined();
      expect(body.doctor?.userId).toBeDefined();
      expect(body.doctor?.createdAt).toBeDefined();
    });

    it('should fail without access token', async () => {
      await request(server).get('/me/profile').expect(401);
    });
  });
});
