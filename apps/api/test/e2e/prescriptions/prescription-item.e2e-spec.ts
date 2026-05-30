import { INestApplication } from '@nestjs/common';
import { Server } from 'http';
import request, { Response } from 'supertest';

import { createTestApp } from '../app.e2e';
import { PrismaService } from '../../../src/shared/infrastructure/prisma/prisma.service';
import { runSeeds } from '../../../prisma/main.seed';
import { getTokensFromCookies } from '../helpers/cookie.helper';
import { doctorEmailSeed, doctorPassSeed } from '../../../prisma/seeders/doctor.seed';
import { patientEmailSeed, patientPassSeed } from '../../../prisma/seeders/patient.seed';
import { clearDB } from '../helpers/clearDB.helper';

describe('PrescriptionController (e2e)', () => {
  let app: INestApplication;
  let server: Server;
  let prismaService: PrismaService;

  let accessTokenPatient: string;
  let accessTokenDoctor: string;

  beforeAll(async () => {
    app = await createTestApp();
    server = app.getHttpServer() as Server;

    prismaService = app.get(PrismaService);

    await prismaService.$connect();

    await clearDB(prismaService);

    await runSeeds();

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

  // describe('POST /prescriptions', () => {
  //   it('should create a prescription', async () => {
  //     const response = await request(server)
  //       .post('/prescriptions')
  //       .set('Cookie', `accessToken=${accessTokenDoctor}`)
  //       .send({
  //         doctorId,
  //         patientId,
  //         notes: 'Take after lunch',
  //         items: [{ name: 'item1' }, { name: 'item2' }],
  //       })
  //       .expect(201);

  //     const body = response.body as PrescriptionResponseDto;

  //     expect(body.id).toBeDefined();
  //     expect(body.code).toBeDefined();
  //     expect(body.notes).toBeDefined();
  //     expect(body.items.length).toBe(2);
  //   });
  // });

  describe('DELETE /prescriptions/:id/items/', () => {
    it('should delete a prescription item', async () => {
      const prescription = await prismaService.prescription.findFirst({
        where: { deletedAt: null },
        include: { items: true },
      });

      expect(prescription?.items.length).toBeGreaterThan(1);

      await request(server)
        .delete(`/prescriptions/${prescription?.id}/items/`)
        .set('Cookie', `accessToken=${accessTokenDoctor}`)
        .send({
          ids: prescription?.items.map((item) => item.id),
        })
        .expect(204);

      const deleted = await prismaService.prescription.findFirst({
        where: {
          id: prescription?.id,
        },
        include: { items: true },
      });

      expect(deleted?.items.length).toBe(0);
    });

    it('should deny patients', async () => {
      const prescription = await prismaService.prescription.findFirst({
        where: { deletedAt: null },
        include: { items: true },
      });

      await request(server)
        .delete(`/prescriptions/${prescription?.id}`)
        .set('Cookie', `accessToken=${accessTokenPatient}`)
        .expect(403);
    });
  });
});
