import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import {
  CannotCreateItemInAConsumedPrescriptionError,
  CannotDeleteConsumedPrescriptionError,
  DoctorIdDoesNotBelongError,
  DomainInternalError,
  OnlyPatientsCanConsumePrescriptions,
  PrescriptionCodeError,
  PrescriptionDoesNotBelongToDoctorError,
  PrescriptionDoesNotBelongToPatientError,
  PrescriptionHasAlreadyConsumed,
  PrescriptionNotFound,
} from '../../domain/errors/prescription.errors';
import {
  PrescriptionItemConflictError,
  PrescriptionItemIdDoesNotMatchError,
  PrescriptionItemNotFound,
} from '../../domain/errors/prescription-item.errors';

export class ErrorMapper {
  public static toHttp(error: unknown): never {
    // ===== NOT FOUND =====

    if (error instanceof PrescriptionNotFound) {
      throw new NotFoundException(error.message);
    }

    if (error instanceof PrescriptionItemNotFound) {
      throw new NotFoundException(error.message);
    }

    // ===== FORBIDDEN =====

    if (error instanceof OnlyPatientsCanConsumePrescriptions) {
      throw new ForbiddenException(error.message);
    }

    if (error instanceof DoctorIdDoesNotBelongError) {
      throw new ForbiddenException(error.message);
    }

    if (error instanceof PrescriptionDoesNotBelongToDoctorError) {
      throw new ForbiddenException(error.message);
    }

    if (error instanceof PrescriptionDoesNotBelongToPatientError) {
      throw new ForbiddenException(error.message);
    }

    // ===== BAD REQUEST =====

    if (error instanceof PrescriptionItemIdDoesNotMatchError) {
      throw new BadRequestException(error.message);
    }

    if (error instanceof CannotDeleteConsumedPrescriptionError) {
      throw new BadRequestException(error.message);
    }

    if (error instanceof CannotCreateItemInAConsumedPrescriptionError) {
      throw new BadRequestException(error.message);
    }

    if (error instanceof PrescriptionHasAlreadyConsumed) {
      throw new BadRequestException(error.message);
    }

    // ===== CONFLICT =====

    if (error instanceof PrescriptionCodeError) {
      throw new ConflictException(error.message);
    }

    if (error instanceof PrescriptionItemConflictError) {
      throw new ConflictException(error.message);
    }

    // ===== INTERNAL =====

    if (error instanceof DomainInternalError) {
      throw new InternalServerErrorException(error.message);
    }

    throw new InternalServerErrorException('Internal server error');
  }
}
