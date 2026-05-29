import { INestApplication } from '@nestjs/common';
import { Server } from 'http';
import request, { Response } from 'supertest';

import { createTestApp } from '../app.e2e';
import { PrismaService } from '../../../src/shared/infrastructure/prisma/prisma.service';
import { runSeeds } from '../../../prisma/main.seed';
import { getTokensFromCookies } from '../helpers/cookie.helper';
import { doctorEmailSeed, doctorPassSeed } from '../../../prisma/seeders/doctor.seed';
import { patientEmailSeed, patientPassSeed } from '../../../prisma/seeders/patient.seed';
import { PrescriptionResponseDto } from '../../../src/modules/prescriptions/infrastructure/dtos/prescription.dto';
import { PrescriptionStatus } from '../../../src/modules/prescriptions/domain/enums/prescription-status.enum';
import { QueryResponse } from '../../../src/shared/infrastructure/dto/filters.dto';
import { clearDB } from '../helpers/clearDB.helper';

describe('PrescriptionController (e2e)', () => {
  let app: INestApplication;
  let server: Server;
  let prismaService: PrismaService;

  let accessTokenPatient: string;
  let accessTokenDoctor: string;

  let doctorId: string;
  let patientId: string;

  async function createPrescription() {
    return prismaService.prescription.create({
      data: {
        doctorId,
        patientId,
        code: crypto.randomUUID(),
        notes: 'test',
        status: PrescriptionStatus.PENDING,
      },
    });
  }

  beforeAll(async () => {
    app = await createTestApp();
    server = app.getHttpServer() as Server;

    prismaService = app.get(PrismaService);

    await prismaService.$connect();

    await clearDB(prismaService);

    await runSeeds();

    const [doctor, patient] = await Promise.all([
      prismaService.doctor.findFirst(),
      prismaService.patient.findFirst(),
    ]);
    doctorId = doctor?.userId || '';
    patientId = patient?.userId || '';

    await app.init();

    // Patient account
    const resPatient = await request(server)
      .post('/auth/login')
      .send({ email: patientEmailSeed, password: patientPassSeed });

    [accessTokenPatient] = getTokensFromCookies(resPatient);

    // Doctor account
    const resDoctor = await request(server)
      .post('/auth/login')
      .send({ email: doctorEmailSeed, password: doctorPassSeed });
    [accessTokenDoctor] = getTokensFromCookies(resDoctor);
  });

  afterAll(async () => {
    await clearDB(prismaService);
    await prismaService.$disconnect();
    await app.close();
  });

  describe('POST /prescription', () => {
    it('should create a prescription', async () => {
      const response = await request(server)
        .post('/prescription')
        .set('Cookie', `accessToken=${accessTokenDoctor}`)
        .send({
          doctorId,
          patientId,
          notes: 'Take after lunch',
        })
        .expect(201);

      const body = response.body as PrescriptionResponseDto;

      expect(body.id).toBeDefined();
      expect(body.code).toBeDefined();
      expect(body.notes).toBeDefined();
    });
  });

  describe('GET /prescription/:id', () => {
    it('should find a prescription', async () => {
      const prescription = await createPrescription();

      const response = await request(server)
        .get(`/prescription/${prescription.id}`)
        .set('Cookie', `accessToken=${accessTokenDoctor}`)
        .expect(200);

      const body = response.body as PrescriptionResponseDto;

      expect(body.id).toBe(prescription.id);
    });

    it('should return 404 when prescription does not exist', async () => {
      await request(server)
        .get(`/prescription/${crypto.randomUUID()}`)
        .set('Cookie', `accessToken=${accessTokenDoctor}`)
        .expect(404);
    });
  });

  describe('GET /prescription', () => {
    it('should return prescriptions', async () => {
      const response = await request(server)
        .get('/prescription')
        .set('Cookie', `accessToken=${accessTokenDoctor}`)
        .expect(200);

      const body = response.body as QueryResponse<PrescriptionResponseDto>;

      expect(body.data.length).toBeGreaterThan(8);
      expect(body.page).toBeDefined();
      expect(body.limit).toBeDefined();
    });

    it('should paginate results', async () => {
      const response = await request(server)
        .get('/prescription?page=1&limit=5')
        .set('Cookie', `accessToken=${accessTokenDoctor}`)
        .expect(200);

      const body = response.body as QueryResponse<PrescriptionResponseDto>;

      expect(body.data.length).toBeLessThanOrEqual(5);
      expect(body.limit).toBe(5);
      expect(body.page).toBe(1);
      expect(body.hasNextPage).toBeTruthy();
    });

    it('should filter by status', async () => {
      const response = await request(server)
        .get('/prescription')
        .query({
          status: PrescriptionStatus.PENDING,
        })
        .set('Cookie', `accessToken=${accessTokenDoctor}`)
        .expect(200);

      const body = response.body as QueryResponse<PrescriptionResponseDto>;

      expect(body.data.every((p) => p.status === PrescriptionStatus.PENDING)).toBe(true);
    });
  });

  describe('PATCH /prescription/:id', () => {
    it('should update notes', async () => {
      const prescription = await createPrescription();

      const response = await request(server)
        .patch(`/prescription/${prescription.id}`)
        .set('Cookie', `accessToken=${accessTokenDoctor}`)
        .send({
          notes: 'Updated notes',
        })
        .expect(200);

      const body = response.body as PrescriptionResponseDto;

      expect(body.notes).toBe('Updated notes');
    });

    it('should deny patient access', async () => {
      const prescription = await createPrescription();

      await request(server)
        .patch(`/prescription/${prescription.id}`)
        .set('Cookie', `accessToken=${accessTokenPatient}`)
        .send({
          notes: 'Updated notes',
        })
        .expect(403);
    });

    it('should fail without authentication', async () => {
      const prescription = await createPrescription();

      await request(server)
        .patch(`/prescription/${prescription.id}`)
        .send({
          notes: 'Updated notes',
        })
        .expect(401);
    });
  });

  describe('PATCH /prescription/:id/status', () => {
    it('should consume prescription', async () => {
      const prescription = await createPrescription();

      await request(server)
        .patch(`/prescription/${prescription.id}/status`)
        .set('Cookie', `accessToken=${accessTokenPatient}`)
        .expect(204);
    });

    it('should deny doctors', async () => {
      const prescription = await createPrescription();

      await request(server)
        .patch(`/prescription/${prescription.id}/status`)
        .set('Cookie', `accessToken=${accessTokenDoctor}`)
        .expect(403);
    });
  });

  describe('DELETE /prescription/:id', () => {
    it('should delete a prescription', async () => {
      const prescription = await createPrescription();

      await request(server)
        .delete(`/prescription/${prescription.id}`)
        .set('Cookie', `accessToken=${accessTokenDoctor}`)
        .expect(204);

      const deleted = await prismaService.prescription.findFirst({
        where: {
          id: prescription.id,
        },
      });

      expect(deleted?.deletedAt).not.toBeNull();
    });

    it('should deny patients', async () => {
      const prescription = await createPrescription();

      await request(server)
        .delete(`/prescription/${prescription.id}`)
        .set('Cookie', `accessToken=${accessTokenPatient}`)
        .expect(403);
    });
  });
});
