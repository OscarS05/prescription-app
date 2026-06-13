import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import type { Response } from 'express';

import { CreatePrescriptionUseCase } from '../../application/use-cases/create-prescription/create-prescription.use-case';
import {
  CreatePrescriptionDto,
  EditPrescriptionDto,
  PrescriptionResponseDto,
  PrescriptionQueryParams,
} from '../dtos/prescription.dto';
import { ErrorMapper } from '../mappers/errors.mappers';
import { FindOnePrescriptionUseCase } from '../../application/use-cases/find-one/find-one.use-case';
import { EditPrescriptionUseCase } from '../../application/use-cases/edit-prescription/edit-prescription.use-case';
import { CurrentUser } from '../../../../shared/infrastructure/decorators/currentUser.decorator';
import type { PayloadToken } from '../../../identity/domain/types/auth.types';
import { Roles } from '../../../../shared/infrastructure/decorators/roles.decorator';
import { RolesGuard } from '../../../../shared/infrastructure/guards/roles.guard';
import { ConsumePrescriptionUseCase } from '../../application/use-cases/consume-prescription/consume-prescription.use-case';
import { DeletePrescriptionUseCase } from '../../application/use-cases/delete-prescription/delete-prescription.use-case';
import { FindAllPrescriptionsUseCase } from '../../application/use-cases/find-all-prescriptions/find-all.use-case';
import { QueryResponse } from '../../../../shared/infrastructure/dto/filters.dto';
import { UserRole } from '../../../../shared/domain/enums/roles.enum';
import { GeneratePrescriptionPdfUseCase } from '../../application/use-cases/generate-pdf/generate-prescription-pdf.use-case';

@Controller('prescriptions')
export class PrescriptionController {
  constructor(
    private readonly findAllPrescriptionsUseCase: FindAllPrescriptionsUseCase,
    private readonly findOnePrescriptionUseCase: FindOnePrescriptionUseCase,
    private readonly createPrescriptionUseCase: CreatePrescriptionUseCase,
    private readonly editPrescriptionUseCase: EditPrescriptionUseCase,
    private readonly consumePrescriptionUseCase: ConsumePrescriptionUseCase,
    private readonly deletePrescriptionUseCase: DeletePrescriptionUseCase,
    private readonly generatePrescriptionPdfUseCase: GeneratePrescriptionPdfUseCase,
  ) {}

  @ApiOperation({
    summary: 'Find prescription',
    description: 'Find a specific prescription by id',
  })
  @ApiResponse({
    status: 200,
    description: 'Prescription data',
    type: PrescriptionResponseDto,
  })
  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.PATIENT)
  @UseGuards(RolesGuard)
  @HttpCode(200)
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<PrescriptionResponseDto> {
    try {
      const result = await this.findOnePrescriptionUseCase.execute(id);
      return PrescriptionResponseDto.fromDomain(result);
    } catch (error) {
      ErrorMapper.toHttp(error as Error);
    }
  }

  @ApiOperation({
    summary: 'Find all prescriptions',
    description: 'Find all the prescriptions with filters',
  })
  @ApiResponse({
    status: 200,
    description: 'List of prescriptions',
    type: QueryResponse<PrescriptionResponseDto>,
  })
  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.PATIENT)
  @UseGuards(RolesGuard)
  @HttpCode(200)
  @Get()
  async findAll(
    @Query() params: PrescriptionQueryParams,
    @CurrentUser() user: PayloadToken,
  ): Promise<QueryResponse<PrescriptionResponseDto>> {
    try {
      const result = await this.findAllPrescriptionsUseCase.execute(user, params);
      return {
        ...result,
        data: result.data.map((p) => PrescriptionResponseDto.fromDomain(p)),
      };
    } catch (error) {
      ErrorMapper.toHttp(error as Error);
    }
  }

  @ApiOperation({
    summary: 'Create prescription',
    description: 'Create a prescription and return it',
  })
  @ApiResponse({
    status: 201,
    description: 'The prescription created',
    type: PrescriptionResponseDto,
  })
  @Roles(UserRole.DOCTOR)
  @UseGuards(RolesGuard)
  @HttpCode(201)
  @Post()
  async create(@Body() body: CreatePrescriptionDto): Promise<PrescriptionResponseDto> {
    try {
      const result = await this.createPrescriptionUseCase.execute(body);
      return PrescriptionResponseDto.fromDomain(result);
    } catch (error) {
      ErrorMapper.toHttp(error as Error);
    }
  }

  @ApiOperation({
    summary: 'Edit prescription',
    description: 'You only can edit the prescription notes',
  })
  @ApiResponse({
    status: 200,
    description: 'The prescription updated',
    type: PrescriptionResponseDto,
  })
  @Roles(UserRole.DOCTOR)
  @UseGuards(RolesGuard)
  @Patch(':id')
  async update(
    @CurrentUser() user: PayloadToken,
    @Param('id') id: string,
    @Body() body: EditPrescriptionDto,
  ): Promise<PrescriptionResponseDto> {
    try {
      const result = await this.editPrescriptionUseCase.execute(id, user.sub, body);
      return PrescriptionResponseDto.fromDomain(result);
    } catch (error) {
      console.log('error:', error);
      ErrorMapper.toHttp(error as Error);
    }
  }

  @ApiOperation({
    summary: 'The patient marks the prescription as consumed',
    description: 'This endpoint should be used to edit the status and consumedAt',
  })
  @ApiResponse({
    status: 204,
  })
  @Roles(UserRole.PATIENT)
  @UseGuards(RolesGuard)
  @HttpCode(204)
  @Patch(':id/status/')
  async consume(@CurrentUser() user: PayloadToken, @Param('id') id: string): Promise<void> {
    try {
      await this.consumePrescriptionUseCase.execute(user, id);
    } catch (error) {
      ErrorMapper.toHttp(error);
    }
  }

  @ApiOperation({
    summary: 'Delete a prescription',
  })
  @ApiResponse({
    status: 204,
  })
  @Roles(UserRole.DOCTOR)
  @UseGuards(RolesGuard)
  @HttpCode(204)
  @Delete(':id')
  async delete(@CurrentUser() user: PayloadToken, @Param('id') id: string): Promise<void> {
    try {
      await this.deletePrescriptionUseCase.execute(id, user.sub);
    } catch (error) {
      ErrorMapper.toHttp(error);
    }
  }

  @ApiOperation({
    summary: 'Generate a PDF with the prescription data',
  })
  @ApiResponse({
    status: 200,
  })
  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.PATIENT)
  @UseGuards(RolesGuard)
  @HttpCode(200)
  @Get(':id/pdf')
  async generatePdf(@Param('id') id: string, @Res() res: Response) {
    try {
      const pdf = await this.generatePrescriptionPdfUseCase.execute(id);

      res.set({
        'Content-Type': 'application/pdf',

        'Content-Disposition': `attachment; filename=prescription.pdf`,
      });

      res.send(pdf);
    } catch (error) {
      console.log('error:', error);
      ErrorMapper.toHttp(error);
    }
  }
}
