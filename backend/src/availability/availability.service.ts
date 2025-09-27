import { 
  Injectable, 
  BadRequestException, 
  NotFoundException,
  ConflictException 
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, LessThan, MoreThan } from 'typeorm';
import { AvailabilitySlot } from '../entities/availability-slot.entity';
import { User, UserType } from '../entities/user.entity';
import { CreateAvailabilityDto, FindAvailabilityQueryDto } from '../dto/availability.dto';

@Injectable()
export class AvailabilityService {
  constructor(
    @InjectRepository(AvailabilitySlot)
    private availabilityRepository: Repository<AvailabilitySlot>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async createAvailability(
    painterId: string,
    createAvailabilityDto: CreateAvailabilityDto,
  ): Promise<AvailabilitySlot> {
    const { startTime, endTime } = createAvailabilityDto;
    
    // Validate painter exists and is a painter
    const painter = await this.userRepository.findOne({
      where: { id: painterId, userType: UserType.PAINTER },
    });

    if (!painter) {
      throw new NotFoundException('Painter not found');
    }

    
    const start = new Date(startTime);
    const end = new Date(endTime);

    // Validate time range
    this.timeRangeValidation(start, end);

    // Check for overlapping slots
    const overlapping = await this.availabilityRepository.findOne({
      where: {
        painterId,
        startTime: LessThan(end),
        endTime: MoreThan(start),
      },
    });

    if (overlapping) {
      throw new ConflictException('Time slot overlaps with existing availability');
    }

    // Create availability slot
    const availabilitySlot = this.availabilityRepository.create({
      painterId,
      startTime: start,
      endTime: end,
    });

    return this.availabilityRepository.save(availabilitySlot);
  }

  async findPainterAvailability(painterId: string): Promise<AvailabilitySlot[]> {
    return this.availabilityRepository.find({
      where: { painterId },
      relations: ['painter'],
      order: { startTime: 'ASC' },
    });
  }

  async findAvailableSlots(query: FindAvailabilityQueryDto): Promise<AvailabilitySlot[]> {
    const queryBuilder = this.availabilityRepository
      .createQueryBuilder('slot')
      .innerJoinAndSelect('slot.painter', 'painter')
      .where('slot.isBooked = :isBooked', { isBooked: false })
      .andWhere('slot.startTime > :now', { now: new Date() });

    if (query.start) {
      queryBuilder.andWhere('slot.startTime >= :start', { start: new Date(query.start) });
    }

    if (query.end) {
      queryBuilder.andWhere('slot.endTime <= :end', { end: new Date(query.end) });
    }

    if (query.painterId) {
      queryBuilder.andWhere('slot.painterId = :painterId', { painterId: query.painterId });
    }

    return queryBuilder
      .orderBy('slot.startTime', 'ASC')
      .getMany();
  }

  async findAvailablePaintersForTimeSlot(
    startTime: Date,
    endTime: Date,
  ): Promise<AvailabilitySlot[]> {
    return this.availabilityRepository
      .createQueryBuilder('slot')
      .innerJoinAndSelect('slot.painter', 'painter')
      .where('slot.isBooked = :isBooked', { isBooked: false })
      .andWhere('slot.startTime <= :startTime', { startTime })
      .andWhere('slot.endTime >= :endTime', { endTime })
      .getMany();
  }

  async markSlotAsBooked(slot: AvailabilitySlot): Promise<void> {
    if (!slot) {
      throw new NotFoundException('Slot not found');
    }
    
    if (slot.isBooked) {
      throw new ConflictException('Slot is already booked');
    }

    await this.availabilityRepository.update(slot.id, { isBooked: true });
  }

  async markSlotAsAvailable(slot: AvailabilitySlot): Promise<void> {
    if (!slot) {
      throw new NotFoundException('Slot not found');
    }
    
    if (!slot.isBooked) {
      throw new ConflictException('Slot is already available');
    }
    
    await this.availabilityRepository.update(slot.id, { isBooked: false });
  }

  async findSlotById(slotId: string): Promise<AvailabilitySlot | null> {
    return this.availabilityRepository.findOne({
      where: { id: slotId },
      relations: ['painter'],
    });
  }

  timeRangeValidation(startTime: Date, endTime: Date): void {
    if (isNaN(startTime.getTime()) || isNaN(endTime.getTime())) {
      throw new BadRequestException('Invalid date format. Please provide valid UTC timestamps.');
    }

    if (startTime >= endTime) {
      throw new BadRequestException('End time must be after start time');
    }

    if (startTime < new Date()) {
      throw new BadRequestException('Cannot create availability in the past');
    }
  }
}

