import { IsDateString, IsUUID, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class CreateAvailabilityDto {
  @ApiProperty({ example: '2025-05-18T10:00:00Z' })
  @IsDateString()
  startTime: string;

  @ApiProperty({ example: '2025-05-18T14:00:00Z' })
  @IsDateString()
  endTime: string;
}

export class AvailabilityResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  painterId: string;

  @ApiProperty()
  startTime: string;

  @ApiProperty()
  endTime: string;

  @ApiProperty()
  isBooked: boolean;

  @ApiProperty()
  createdAt: string;

  @ApiProperty({ required: false })
  painter?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
}

export class FindAvailabilityQueryDto {
  @ApiProperty({ example: '2025-05-18', required: false })
  @IsOptional()
  @IsDateString()
  @Transform(({ value }) => value ? new Date(value).toISOString() : undefined)
  start?: string;

  @ApiProperty({ example: '2025-05-19', required: false })
  @IsOptional()
  @IsDateString()
  @Transform(({ value }) => value ? new Date(value).toISOString() : undefined)
  end?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID()
  painterId?: string;
}

