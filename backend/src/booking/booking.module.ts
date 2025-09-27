import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookingService } from './booking.service';
import { BookingController } from './booking.controller';
import { PainterAssignmentService } from './painter-assignment.service';
import { Booking } from '../entities/booking.entity';
import { User } from '../entities/user.entity';
import { AvailabilitySlot } from '../entities/availability-slot.entity';
import { AvailabilityModule } from '../availability/availability.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Booking, User, AvailabilitySlot]),
    AvailabilityModule,
  ],
  controllers: [BookingController],
  providers: [BookingService, PainterAssignmentService],
  exports: [BookingService],
})
export class BookingModule {}

