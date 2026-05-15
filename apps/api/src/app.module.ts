import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { validationSchema } from './shared/infrastructure/env/validate-envs';
import { AuthModule } from './modules/identity/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema,
    }),
    AuthModule,
  ],
})
export class AppModule {}
