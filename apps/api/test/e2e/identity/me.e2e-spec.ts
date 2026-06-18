import { INestApplication } from '@nestjs/common';
import { Server } from 'http';
import request, { Response } from 'supertest';

import { createTestApp } from '../app.e2e';
import { PrismaService } from '../../../src/shared/infrastructure/prisma/prisma.service';
import { runSeeds } from '../../../prisma/main.seed';
import { getTokensFromCookies } from '../helpers/cookie.helper';
import { UserResponseDto } from '../../../src/modules/identity/infrastructure/dtos/auth.dto';
import { doctorEmailSeed, doctorPassSeed } from '../../../prisma/seeders/doctor.seed';
import { SignatureResponseDto } from '../../../src/modules/identity/infrastructure/dtos/signature.dto';
import { patientEmailSeed, patientPassSeed } from '../../../prisma/seeders/patient.seed';

describe('MeController (e2e)', () => {
  let app: INestApplication;
  let server: Server;
  let prismaService: PrismaService;

  let accessTokenDoctor: string;
  let accessCookieDoctor: string;

  let accessTokenPatient: string;
  let accessCookiePatient: string;

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
    const resDoctor = await request(server)
      .post('/auth/login')
      .send({ email: doctorEmailSeed, password: doctorPassSeed });
    [accessTokenDoctor] = getTokensFromCookies(resDoctor);
    accessCookieDoctor = `accessToken=${accessTokenDoctor}`;

    // Patient account
    const resPatient = await request(server)
      .post('/auth/login')
      .send({ email: patientEmailSeed, password: patientPassSeed });
    [accessTokenPatient] = getTokensFromCookies(resPatient);
    accessCookiePatient = `accessToken=${accessTokenPatient}`;
  });

  afterAll(async () => {
    await prismaService.$disconnect();
    await app.close();
  });

  describe('GET /me/profile', () => {
    it('should get current user profile', async () => {
      const response = await request(server)
        .get('/me/profile')
        .set('Cookie', accessCookieDoctor)
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

  describe('POST /me/signature', () => {
    it('should create a new signature', async () => {
      const response = await request(server)
        .post('/me/signature')
        .set('Cookie', accessCookieDoctor)
        .attach('signature', Buffer.from('fake-image'), 'signature.png')
        .expect(201);

      const body = response.body as SignatureResponseDto;
      expect(body.id).toBeDefined();
      expect(body.doctorId).toBeDefined();
      expect(body.imageUrl).toMatch(/^\/uploads\/signatures\//);
      expect(body.isActive).toBeTruthy();
    });

    it('should fail without access token', async () => {
      await request(server)
        .post('/me/signature')
        .attach('signature', Buffer.from('fake-image'), 'signature.png')
        .expect(401);
    });

    it('should fail when file is missing', async () => {
      await request(server)
        .post('/me/signature')
        .set('Cookie', accessCookieDoctor)
        .expect(400);
    });

    it('should fail with invalid file type', async () => {
      await request(server)
        .post('/me/signature')
        .set('Cookie', accessCookieDoctor)
        .attach('signature', Buffer.from('fake-pdf'), 'document.pdf')
        .expect(400);
    });

    it('should fail if user is not a doctor', async () => {
      await request(server)
        .post('/me/signature')
        .set('Cookie', accessCookiePatient)
        .attach('signature', Buffer.from('fake-image'), 'signature.png')
        .expect(403);
    });
  });
});
