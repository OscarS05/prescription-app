import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';

import { PrismaModule } from '../../shared/infrastructure/prisma/prisma.module';
import { AuthController } from './infrastructure/controllers/auth.controller';
import { TokenService } from './domain/ports/token.service';
import { TokenServiceAdapter } from './infrastructure/services/token.service';
import { HashService } from './domain/ports/hash.service';
import { HashServiceAdapter } from './infrastructure/services/hash.service';
import { AccessTokenGuard } from '../../shared/infrastructure/guards/accessToken.guard';
import { LoginUseCase } from './application/use-cases/login/login.use-case';
import { GetUserInfoUseCase } from './application/use-cases/get-user-info/get-user-info.use-case';
import { LogoutUseCase } from './application/use-cases/logout/logout.use-case';
import { RefreshSessionUseCase } from './application/use-cases/refresh-session/refresh-session.use-case';
import { RegisterUserUseCase } from './application/use-cases/regiser-user/register-user.use-case';
import { UserRepository } from './domain/ports/user.repository';
import { UserRepositoryPrismaAdapter } from './infrastructure/db/user.repository';
import { DoctorRepository } from './domain/ports/doctor.repository';
import { DoctorRepositoryPrismaAdapter } from './infrastructure/db/doctor.repository';
import { PatientRepository } from './domain/ports/patient.repository';
import { PatientRepositoryPrismaAdapter } from './infrastructure/db/patient.repository';
import { SessionManagerService } from './application/services/session-manager/session-manager.service';
import { UsersController } from './infrastructure/controllers/users.controller';
import { GetUsersUseCase } from './application/use-cases/get-users/get-users.use-case';

@Module({
  imports: [PrismaModule, JwtModule.register({})],
  controllers: [AuthController, UsersController],
  providers: [
    { provide: UserRepository, useClass: UserRepositoryPrismaAdapter },
    { provide: DoctorRepository, useClass: DoctorRepositoryPrismaAdapter },
    { provide: PatientRepository, useClass: PatientRepositoryPrismaAdapter },
    { provide: TokenService, useClass: TokenServiceAdapter },
    { provide: HashService, useClass: HashServiceAdapter },
    { provide: APP_GUARD, useClass: AccessTokenGuard },
    LoginUseCase,
    GetUserInfoUseCase,
    LogoutUseCase,
    RefreshSessionUseCase,
    RegisterUserUseCase,
    SessionManagerService,
    GetUsersUseCase,
  ],
})
export class AuthModule {}
