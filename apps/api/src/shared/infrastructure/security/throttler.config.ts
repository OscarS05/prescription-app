import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ThrottlerModuleOptions, ThrottlerOptionsFactory } from '@nestjs/throttler';

export enum ThrottlerType {
  GLOBAL = 'global',
  AUTH = 'auth',
}

@Injectable()
export class ThrottlerConfigService implements ThrottlerOptionsFactory {
  constructor(private readonly configService: ConfigService) {}

  createThrottlerOptions(): Promise<ThrottlerModuleOptions> | ThrottlerModuleOptions {
    return [
      {
        name: ThrottlerType.GLOBAL,
        ttl: this.configService.getOrThrow<number>('THROTTLE_GLOBAL_TTL'),
        limit: this.configService.getOrThrow<number>('THROTTLER_GLOBAL_LIMIT'),
      },
      {
        name: ThrottlerType.AUTH,
        ttl: this.configService.getOrThrow<number>('THROTTLE_AUTH_TTL'),
        limit: this.configService.getOrThrow<number>('THROTTLER_AUTH_LIMIT'),
      },
    ];
  }
}
