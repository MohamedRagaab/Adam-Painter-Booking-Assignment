import { IsDateString, IsUUID, IsEnum, IsOptional, Allow } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { BookingStatus } from '../entities/booking.entity';

export class CreateBookingDto {
  @ApiProperty({ example: '2025-05-18T11:00:00Z' })
  @IsDateString()
  startTime: string;

  @ApiProperty({ example: '2025-05-18T13:00:00Z' })
  @IsDateString()
  endTime: string;
}

export class BookingResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  customerId: string;

  @ApiProperty()
  painterId: string;

  @ApiProperty()
  startTime: string;

  @ApiProperty()
  endTime: string;

  @ApiProperty({ enum: BookingStatus })
  status: BookingStatus;

  @ApiProperty()
  createdAt: string;

  @ApiProperty()
  updatedAt: string;

  @ApiProperty({ required: false })
  customer?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };

  @ApiProperty({ required: false })
  painter?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };

  @ApiProperty({ required: false })
  availabilitySlot?: {
    id: string;
    startTime: string;
    endTime: string;
  };
}

export class UpdateBookingStatusDto {
  @ApiProperty({ enum: BookingStatus })
  @IsEnum(BookingStatus)
  status: BookingStatus;
}

export class BookingQueryDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsEnum(BookingStatus)
  status?: BookingStatus;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @Allow()
  client?: any;

  @Allow()
  'queryKey[]'?: any;

  @Allow()
  signal?: any;
}

export class PainterInfoDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;
}

export class AlternativeSlotDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  painterId: string;

  @ApiProperty()
  startTime: string;

  @ApiProperty()
  endTime: string;

  @ApiProperty({ type: PainterInfoDto })
  painter: PainterInfoDto;
}

export class BookingCreateResponseDto {
  @ApiProperty({ type: BookingResponseDto, required: false })
  booking?: BookingResponseDto;

  @ApiProperty({ type: [AlternativeSlotDto], required: false })
  alternatives?: AlternativeSlotDto[];
}

