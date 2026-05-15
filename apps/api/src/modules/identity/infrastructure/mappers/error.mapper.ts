import {
  ConflictException,
  NotFoundException,
  UnauthorizedException,
  InternalServerErrorException,
  HttpException,
} from '@nestjs/common';

import {
  DomainNotFoundError,
  EmailAlreadyInUseError,
  InvalidCredentialsError,
  InvalidSessionError,
  InvalidTokenError,
} from '../../domain/errors/auth.errors';

export class ErrorMapper {
  static toHttp(error: unknown): HttpException {
    if (error instanceof EmailAlreadyInUseError) {
      return new ConflictException(error.message);
    }

    if (error instanceof InvalidCredentialsError) {
      return new UnauthorizedException(error.message);
    }

    if (error instanceof InvalidSessionError) {
      return new UnauthorizedException(error.message);
    }

    if (error instanceof InvalidTokenError) {
      return new UnauthorizedException(error.message);
    }

    if (error instanceof DomainNotFoundError) {
      return new NotFoundException(error.message);
    }

    return new InternalServerErrorException('Internal server error');
  }
}
