import { Injectable } from '@nestjs/common';
import { UserRepository } from '../../../domain/ports/user.repository';
import { HashService } from '../../../domain/ports/hash.service';
import { EmailAlreadyInUseError } from '../../../domain/errors/auth.errors';
import { CredentialRegister, UserInfo } from '../../../domain/types/auth.types';
import { PatientRepository } from '../../../domain/ports/patient.repository';
import { DoctorRepository } from '../../../domain/ports/doctor.repository';
import { UserRole } from '../../../../../shared/domain/enums/roles.enum';

@Injectable()
export class CreateUserUseCase {
  constructor(
    private readonly hashService: HashService,
    private readonly usersRepo: UserRepository,
    private readonly patientRepo: PatientRepository,
    private readonly doctorRepo: DoctorRepository,
  ) {}

  public async execute(data: CredentialRegister): Promise<UserInfo> {
    const user = await this.usersRepo.findByEmail(data.email);
    if (user) throw new EmailAlreadyInUseError();

    const hashedPassword = await this.hashService.hash(data.password);
    const newUser = await this.usersRepo.create({
      ...data,
      password: hashedPassword,
    });

    if (data.role === UserRole.DOCTOR) {
      const doctor = await this.doctorRepo.create({
        userId: newUser.id,
        specialty: null,
      });

      newUser.doctor = doctor;
    }

    if (data.role === UserRole.PATIENT) {
      const patient = await this.patientRepo.create({
        userId: newUser.id,
        birthDate: null,
      });
      newUser.patient = patient;
    }

    return newUser;
  }
}
