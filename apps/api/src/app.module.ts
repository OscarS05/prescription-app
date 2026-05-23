import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { validationSchema } from './shared/infrastructure/env/validate-envs';
import { AuthModule } from './modules/identity/auth.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { ThrottlerConfigService } from './shared/infrastructure/security/throttler.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema,
    }),
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      useClass: ThrottlerConfigService,
    }),
    AuthModule,
  ],
})
export class AppModule {}
