import { 
  Injectable, 
  BadRequestException, 
  NotFoundException,
  ConflictException 
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Booking, BookingStatus } from '../entities/booking.entity';
import { User, UserType } from '../entities/user.entity';
import { AvailabilitySlot } from '../entities/availability-slot.entity';
import { AvailabilityService } from '../availability/availability.service';
import { PainterAssignmentService } from './painter-assignment.service';
import { 
  CreateBookingDto, 
  UpdateBookingStatusDto, 
  BookingQueryDto,
  AlternativeSlotDto 
} from '../dto/booking.dto';

@Injectable()
export class BookingService {
  constructor(
    @InjectRepository(Booking)
    private bookingRepository: Repository<Booking>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private availabilityService: AvailabilityService,
    private painterAssignmentService: PainterAssignmentService,
  ) {}

  async createBooking(
    customerId: string,
    createBookingDto: CreateBookingDto,
  ): Promise<{ booking?: Booking; alternatives?: AlternativeSlotDto[] }> {
    const { startTime, endTime } = createBookingDto;
    
    // Validate customer exists and is a customer
    const customer = await this.userRepository.findOne({
      where: { id: customerId, userType: UserType.CUSTOMER },
    });

    if (!customer) {
      throw new NotFoundException('Customer not found');
    }

    // Validate time range
    const start = new Date(startTime);
    const end = new Date(endTime);

    if (start >= end) {
      throw new BadRequestException('End time must be after start time');
    }

    if (start < new Date()) {
      throw new BadRequestException('Cannot book in the past');
    }

    // Find available painters for the requested time slot
    const availableSlots = await this.availabilityService.findAvailablePaintersForTimeSlot(
      start,
      end,
    );

    if (availableSlots.length === 0) {
      // No painters available - find alternatives
      const alternatives = await this.painterAssignmentService.findAlternativeSlots(
        start,
        end,
      );

      const alternativeDtos: AlternativeSlotDto[] = alternatives.map(slot => ({
        id: slot.id,
        painterId: slot.painterId,
        startTime: slot.startTime.toISOString(),
        endTime: slot.endTime.toISOString(),
        painter: {
          id: slot.painter.id,
          firstName: slot.painter.firstName,
          lastName: slot.painter.lastName,
        },
      }));

      return { alternatives: alternativeDtos };
    }

    // Assign the best painter
    const selectedSlot = await this.painterAssignmentService.findBestPainter(availableSlots);

    // Create the booking
    const booking = this.bookingRepository.create({
      customerId,
      painterId: selectedSlot.painterId,
      availabilitySlotId: selectedSlot.id,
      startTime: start,
      endTime: end,
      status: BookingStatus.CONFIRMED,
    });

    const savedBooking = await this.bookingRepository.save(booking);

    // Mark the availability slot as booked
    await this.availabilityService.markSlotAsBooked(selectedSlot.id);

    // Reload with relations
    const bookingWithRelations = await this.bookingRepository.findOne({
      where: { id: savedBooking.id },
      relations: ['customer', 'painter', 'availabilitySlot'],
    });

    return { booking: bookingWithRelations || undefined };
  }

  async findUserBookings(userId: string, query: BookingQueryDto = {}): Promise<Booking[]> {
    const queryBuilder = this.bookingRepository
      .createQueryBuilder('booking')
      .leftJoinAndSelect('booking.customer', 'customer')
      .leftJoinAndSelect('booking.painter', 'painter')
      .leftJoinAndSelect('booking.availabilitySlot', 'slot')
      .where('(booking.customerId = :userId OR booking.painterId = :userId)', { userId });

    if (query.status) {
      queryBuilder.andWhere('booking.status = :status', { status: query.status });
    }

    if (query.startDate) {
      queryBuilder.andWhere('booking.startTime >= :startDate', { 
        startDate: new Date(query.startDate) 
      });
    }

    if (query.endDate) {
      queryBuilder.andWhere('booking.endTime <= :endDate', { 
        endDate: new Date(query.endDate) 
      });
    }

    return queryBuilder
      .orderBy('booking.startTime', 'ASC')
      .getMany();
  }

  async findBookingById(bookingId: string, userId?: string): Promise<Booking> {
    const queryBuilder = this.bookingRepository
      .createQueryBuilder('booking')
      .leftJoinAndSelect('booking.customer', 'customer')
      .leftJoinAndSelect('booking.painter', 'painter')
      .leftJoinAndSelect('booking.availabilitySlot', 'slot')
      .where('booking.id = :bookingId', { bookingId });

    if (userId) {
      queryBuilder.andWhere(
        '(booking.customerId = :userId OR booking.painterId = :userId)',
        { userId }
      );
    }

    const booking = await queryBuilder.getOne();

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    return booking;
  }

  async updateBookingStatus(
    bookingId: string,
    updateStatusDto: UpdateBookingStatusDto,
    userId: string,
  ): Promise<Booking> {
    const booking = await this.findBookingById(bookingId, userId);

    // Validate status transition
    if (booking.status === BookingStatus.CANCELLED) {
      throw new BadRequestException('Cannot update cancelled booking');
    }

    if (updateStatusDto.status === booking.status) {
      throw new BadRequestException('Booking already has this status');
    }

    // Update status
    booking.status = updateStatusDto.status;
    booking.updatedAt = new Date();

    const updatedBooking = await this.bookingRepository.save(booking);

    // If booking is cancelled, free up the availability slot
    if (updateStatusDto.status === BookingStatus.CANCELLED && booking.availabilitySlotId) {
      await this.availabilityService.markSlotAsBooked(booking.availabilitySlotId);
      // Update the slot to not booked (implementation depends on your needs)
    }

    return updatedBooking;
  }

  async bookAlternativeSlot(
    customerId: string,
    slotId: string,
    duration: number,
  ): Promise<Booking> {
    // Validate customer
    const customer = await this.userRepository.findOne({
      where: { id: customerId, userType: UserType.CUSTOMER },
    });

    if (!customer) {
      throw new NotFoundException('Customer not found');
    }

    // Find the availability slot
    const slot = await this.availabilityService.findSlotById(slotId);
    if (!slot || slot.isBooked) {
      throw new NotFoundException('Availability slot not found or already booked');
    }

    // Calculate end time based on duration
    const endTime = new Date(slot.startTime.getTime() + duration);

    if (endTime > slot.endTime) {
      throw new BadRequestException('Requested duration exceeds available slot time');
    }

    // Create the booking
    const booking = this.bookingRepository.create({
      customerId,
      painterId: slot.painterId,
      availabilitySlotId: slot.id,
      startTime: slot.startTime,
      endTime,
      status: BookingStatus.CONFIRMED,
    });

    const savedBooking = await this.bookingRepository.save(booking);

    // Mark the availability slot as booked
    await this.availabilityService.markSlotAsBooked(slot.id);

    // Reload with relations
    const bookingWithRelations = await this.bookingRepository.findOne({
      where: { id: savedBooking.id },
      relations: ['customer', 'painter', 'availabilitySlot'],
    });

    if (!bookingWithRelations) {
      throw new NotFoundException('Booking not found after creation');
    }

    return bookingWithRelations;
  }
}
