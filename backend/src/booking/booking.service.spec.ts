import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BadRequestException, NotFoundException, ConflictException } from '@nestjs/common';
import { BookingService } from './booking.service';
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

describe('BookingService', () => {
  let service: BookingService;
  let bookingRepository: Repository<Booking>;
  let userRepository: Repository<User>;
  let availabilityService: AvailabilityService;
  let painterAssignmentService: PainterAssignmentService;

  const mockBookingRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    createQueryBuilder: jest.fn(),
  };

  const mockUserRepository = {
    findOne: jest.fn(),
  };

  const mockAvailabilityService = {
    timeRangeValidation: jest.fn(),
    findAvailablePaintersForTimeSlot: jest.fn(),
    markSlotAsBooked: jest.fn(),
    findSlotById: jest.fn(),
  };

  const mockPainterAssignmentService = {
    findAlternativeSlots: jest.fn(),
    findBestPainter: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookingService,
        {
          provide: getRepositoryToken(Booking),
          useValue: mockBookingRepository,
        },
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
        {
          provide: AvailabilityService,
          useValue: mockAvailabilityService,
        },
        {
          provide: PainterAssignmentService,
          useValue: mockPainterAssignmentService,
        },
      ],
    }).compile();

    service = module.get<BookingService>(BookingService);
    bookingRepository = module.get<Repository<Booking>>(getRepositoryToken(Booking));
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    availabilityService = module.get<AvailabilityService>(AvailabilityService);
    painterAssignmentService = module.get<PainterAssignmentService>(PainterAssignmentService);

    jest.clearAllMocks();
  });

  describe('createBooking', () => {
    const customerId = 'customer-id';
    const createBookingDto: CreateBookingDto = {
      startTime: '2025-05-18T10:00:00Z',
      endTime: '2025-05-18T12:00:00Z',
    };

    it('should successfully create a booking when painters are available', async () => {
      const customer = {
        id: customerId,
        userType: UserType.CUSTOMER,
        firstName: 'John',
        lastName: 'Doe',
      };

      const availableSlot = {
        id: 'slot-id',
        painterId: 'painter-id',
        startTime: new Date(createBookingDto.startTime),
        endTime: new Date(createBookingDto.endTime),
      };

      const selectedSlot = {
        id: 'slot-id',
        painterId: 'painter-id',
      };

      const savedBooking = {
        id: 'booking-id',
        customerId,
        painterId: 'painter-id',
        availabilitySlotId: 'slot-id',
        startTime: new Date(createBookingDto.startTime),
        endTime: new Date(createBookingDto.endTime),
        status: BookingStatus.CONFIRMED,
      };

      const bookingWithRelations = {
        ...savedBooking,
        customer,
        painter: { id: 'painter-id', firstName: 'Jane', lastName: 'Smith' },
        availabilitySlot: availableSlot,
      };

      mockUserRepository.findOne.mockResolvedValue(customer);
      mockAvailabilityService.findAvailablePaintersForTimeSlot.mockResolvedValue([availableSlot]);
      mockPainterAssignmentService.findBestPainter.mockResolvedValue(selectedSlot);
      mockBookingRepository.create.mockReturnValue(savedBooking);
      mockBookingRepository.save.mockResolvedValue(savedBooking);
      mockBookingRepository.findOne.mockResolvedValue(bookingWithRelations);

      const result = await service.createBooking(customerId, createBookingDto);

      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { id: customerId },
      });
      expect(mockAvailabilityService.timeRangeValidation).toHaveBeenCalledWith(
        new Date(createBookingDto.startTime),
        new Date(createBookingDto.endTime)
      );
      expect(mockAvailabilityService.findAvailablePaintersForTimeSlot).toHaveBeenCalledWith(
        new Date(createBookingDto.startTime),
        new Date(createBookingDto.endTime)
      );
      expect(mockPainterAssignmentService.findBestPainter).toHaveBeenCalledWith([availableSlot]);
      expect(mockBookingRepository.create).toHaveBeenCalledWith({
        customerId,
        painterId: selectedSlot.painterId,
        availabilitySlotId: selectedSlot.id,
        startTime: new Date(createBookingDto.startTime),
        endTime: new Date(createBookingDto.endTime),
        status: BookingStatus.CONFIRMED,
      });
      expect(mockAvailabilityService.markSlotAsBooked).toHaveBeenCalledWith(selectedSlot.id);
      expect(result).toEqual({ booking: bookingWithRelations });
    });

    it('should return alternatives when no painters are available', async () => {
      const customer = {
        id: customerId,
        userType: UserType.CUSTOMER,
        firstName: 'John',
        lastName: 'Doe',
      };

      const alternatives = [
        {
          id: 'alt-slot-1',
          painterId: 'painter-1',
          startTime: new Date('2025-05-19T10:00:00Z'),
          endTime: new Date('2025-05-19T12:00:00Z'),
          painter: {
            id: 'painter-1',
            firstName: 'Jane',
            lastName: 'Smith',
          },
        },
      ];

      mockUserRepository.findOne.mockResolvedValue(customer);
      mockAvailabilityService.findAvailablePaintersForTimeSlot.mockResolvedValue([]);
      mockPainterAssignmentService.findAlternativeSlots.mockResolvedValue(alternatives);

      const result = await service.createBooking(customerId, createBookingDto);

      expect(mockPainterAssignmentService.findAlternativeSlots).toHaveBeenCalledWith(
        new Date(createBookingDto.startTime),
        new Date(createBookingDto.endTime)
      );
      expect(result).toEqual({
        alternatives: [
          {
            id: 'alt-slot-1',
            painterId: 'painter-1',
            startTime: '2025-05-19T10:00:00.000Z',
            endTime: '2025-05-19T12:00:00.000Z',
            painter: {
              id: 'painter-1',
              firstName: 'Jane',
              lastName: 'Smith',
            },
          },
        ],
      });
    });

    it('should throw NotFoundException if customer not found', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(
        service.createBooking(customerId, createBookingDto)
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException if customer is not a customer type', async () => {
      const painter = {
        id: customerId,
        userType: UserType.PAINTER,
      };

      mockUserRepository.findOne.mockResolvedValue(painter);

      await expect(
        service.createBooking(customerId, createBookingDto)
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('findUserBookings', () => {
    const userId = 'user-id';

    it('should return user bookings with default query', async () => {
      const mockQueryBuilder = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue([]),
      };

      mockBookingRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);

      const result = await service.findUserBookings(userId);

      expect(mockBookingRepository.createQueryBuilder).toHaveBeenCalledWith('booking');
      expect(mockQueryBuilder.leftJoinAndSelect).toHaveBeenCalledWith('booking.customer', 'customer');
      expect(mockQueryBuilder.leftJoinAndSelect).toHaveBeenCalledWith('booking.painter', 'painter');
      expect(mockQueryBuilder.leftJoinAndSelect).toHaveBeenCalledWith('booking.availabilitySlot', 'slot');
      expect(mockQueryBuilder.where).toHaveBeenCalledWith(
        '(booking.customerId = :userId OR booking.painterId = :userId)',
        { userId }
      );
      expect(mockQueryBuilder.orderBy).toHaveBeenCalledWith('booking.startTime', 'ASC');
      expect(result).toEqual([]);
    });

    it('should apply status filter when provided', async () => {
      const query: BookingQueryDto = { status: BookingStatus.CONFIRMED };
      const mockQueryBuilder = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue([]),
      };

      mockBookingRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);

      await service.findUserBookings(userId, query);

      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'booking.status = :status',
        { status: BookingStatus.CONFIRMED }
      );
    });

    it('should apply date filters when provided', async () => {
      const query: BookingQueryDto = {
        startDate: '2025-05-01T00:00:00Z',
        endDate: '2025-05-31T23:59:59Z',
      };
      const mockQueryBuilder = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue([]),
      };

      mockBookingRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);

      await service.findUserBookings(userId, query);

      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'booking.startTime >= :startDate',
        { startDate: new Date(query.startDate!) }
      );
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'booking.endTime <= :endDate',
        { endDate: new Date(query.endDate!) }
      );
    });
  });

  describe('findBookingById', () => {
    const bookingId = 'booking-id';
    const userId = 'user-id';

    it('should return booking when found', async () => {
      const booking = {
        id: bookingId,
        customerId: 'customer-id',
        painterId: 'painter-id',
        status: BookingStatus.CONFIRMED,
      };

      const mockQueryBuilder = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(booking),
      };

      mockBookingRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);

      const result = await service.findBookingById(bookingId, userId);

      expect(mockQueryBuilder.where).toHaveBeenCalledWith('booking.id = :bookingId', { bookingId });
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        '(booking.customerId = :userId OR booking.painterId = :userId)',
        { userId }
      );
      expect(result).toEqual(booking);
    });

    it('should return booking without user filter when userId not provided', async () => {
      const booking = {
        id: bookingId,
        customerId: 'customer-id',
        painterId: 'painter-id',
        status: BookingStatus.CONFIRMED,
      };

      const mockQueryBuilder = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(booking),
      };

      mockBookingRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);

      const result = await service.findBookingById(bookingId);

      expect(mockQueryBuilder.where).toHaveBeenCalledWith('booking.id = :bookingId', { bookingId });
      expect(mockQueryBuilder.andWhere).not.toHaveBeenCalled();
      expect(result).toEqual(booking);
    });

    it('should throw NotFoundException when booking not found', async () => {
      const mockQueryBuilder = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(null),
      };

      mockBookingRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);

      await expect(
        service.findBookingById(bookingId, userId)
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateBookingStatus', () => {
    const bookingId = 'booking-id';
    const userId = 'user-id';
    const updateStatusDto: UpdateBookingStatusDto = {
      status: BookingStatus.CONFIRMED,
    };

    it('should successfully update booking status', async () => {
      const existingBooking = {
        id: bookingId,
        customerId: 'customer-id',
        painterId: 'painter-id',
        availabilitySlotId: 'slot-id',
        startTime: new Date('2025-05-18T10:00:00Z'),
        endTime: new Date('2025-05-18T12:00:00Z'),
        status: BookingStatus.PENDING,
        createdAt: new Date('2025-01-01T00:00:00Z'),
        updatedAt: new Date('2025-01-01T00:00:00Z'),
        customer: undefined,
        painter: undefined,
        availabilitySlot: undefined,
      } as Partial<Booking>;

      const updatedBooking = {
        ...existingBooking,
        status: BookingStatus.CONFIRMED,
        updatedAt: new Date('2025-01-01T01:00:00Z'),
      };

      jest.spyOn(service, 'findBookingById').mockResolvedValue(existingBooking as Booking);
      mockBookingRepository.save.mockResolvedValue(updatedBooking);

      const result = await service.updateBookingStatus(bookingId, updateStatusDto, userId);

      expect(service.findBookingById).toHaveBeenCalledWith(bookingId, userId);
      expect(mockBookingRepository.save).toHaveBeenCalledWith({
        ...existingBooking,
        status: BookingStatus.CONFIRMED,
        updatedAt: expect.any(Date),
      });
      expect(result).toEqual(updatedBooking);
    });

    it('should throw BadRequestException when trying to update cancelled booking', async () => {
      const cancelledBooking = {
        id: bookingId,
        customerId: 'customer-id',
        painterId: 'painter-id',
        availabilitySlotId: 'slot-id',
        startTime: new Date('2025-05-18T10:00:00Z'),
        endTime: new Date('2025-05-18T12:00:00Z'),
        status: BookingStatus.CANCELLED,
        createdAt: new Date('2025-01-01T00:00:00Z'),
        updatedAt: new Date('2025-01-01T00:00:00Z'),
        customer: undefined,
        painter: undefined,
        availabilitySlot: undefined,
      } as Partial<Booking>;

      jest.spyOn(service, 'findBookingById').mockResolvedValue(cancelledBooking as Booking);

      await expect(
        service.updateBookingStatus(bookingId, updateStatusDto, userId)
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException when status is the same', async () => {
      const existingBooking = {
        id: bookingId,
        customerId: 'customer-id',
        painterId: 'painter-id',
        availabilitySlotId: 'slot-id',
        startTime: new Date('2025-05-18T10:00:00Z'),
        endTime: new Date('2025-05-18T12:00:00Z'),
        status: BookingStatus.CONFIRMED,
        createdAt: new Date('2025-01-01T00:00:00Z'),
        updatedAt: new Date('2025-01-01T00:00:00Z'),
        customer: undefined,
        painter: undefined,
        availabilitySlot: undefined,
      } as Partial<Booking>;

      jest.spyOn(service, 'findBookingById').mockResolvedValue(existingBooking as Booking);

      await expect(
        service.updateBookingStatus(bookingId, updateStatusDto, userId)
      ).rejects.toThrow(BadRequestException);
    });

    it('should free up availability slot when booking is cancelled', async () => {
      const existingBooking = {
        id: bookingId,
        customerId: 'customer-id',
        painterId: 'painter-id',
        availabilitySlotId: 'slot-id',
        startTime: new Date('2025-05-18T10:00:00Z'),
        endTime: new Date('2025-05-18T12:00:00Z'),
        status: BookingStatus.CONFIRMED,
        createdAt: new Date('2025-01-01T00:00:00Z'),
        updatedAt: new Date('2025-01-01T00:00:00Z'),
        customer: undefined,
        painter: undefined,
        availabilitySlot: undefined,
      } as Partial<Booking>;

      const updateCancelDto: UpdateBookingStatusDto = {
        status: BookingStatus.CANCELLED,
      };

      jest.spyOn(service, 'findBookingById').mockResolvedValue(existingBooking as Booking);
      mockBookingRepository.save.mockResolvedValue({
        ...existingBooking,
        status: BookingStatus.CANCELLED,
      });

      await service.updateBookingStatus(bookingId, updateCancelDto, userId);

      expect(mockAvailabilityService.markSlotAsBooked).toHaveBeenCalledWith('slot-id');
    });
  });

  describe('bookAlternativeSlot', () => {
    const customerId = 'customer-id';
    const slotId = 'slot-id';
    const duration = 2 * 60 * 60 * 1000; // 2 hours in milliseconds

    it('should successfully book alternative slot', async () => {
      const customer = {
        id: customerId,
        userType: UserType.CUSTOMER,
        firstName: 'John',
        lastName: 'Doe',
      };

      const slot = {
        id: slotId,
        painterId: 'painter-id',
        startTime: new Date('2025-05-18T10:00:00Z'),
        endTime: new Date('2025-05-18T16:00:00Z'),
        isBooked: false,
      };

      const savedBooking = {
        id: 'booking-id',
        customerId,
        painterId: 'painter-id',
        availabilitySlotId: slotId,
        startTime: slot.startTime,
        endTime: new Date(slot.startTime.getTime() + duration),
        status: BookingStatus.CONFIRMED,
      };

      const bookingWithRelations = {
        ...savedBooking,
        customer,
        painter: { id: 'painter-id', firstName: 'Jane', lastName: 'Smith' },
        availabilitySlot: slot,
      };

      mockUserRepository.findOne.mockResolvedValue(customer);
      mockAvailabilityService.findSlotById.mockResolvedValue(slot);
      mockBookingRepository.create.mockReturnValue(savedBooking);
      mockBookingRepository.save.mockResolvedValue(savedBooking);
      mockBookingRepository.findOne.mockResolvedValue(bookingWithRelations);

      const result = await service.bookAlternativeSlot(customerId, slotId, duration);

      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { id: customerId },
      });
      expect(mockAvailabilityService.findSlotById).toHaveBeenCalledWith(slotId);
      expect(mockBookingRepository.create).toHaveBeenCalledWith({
        customerId,
        painterId: slot.painterId,
        availabilitySlotId: slot.id,
        startTime: slot.startTime,
        endTime: new Date(slot.startTime.getTime() + duration),
        status: BookingStatus.CONFIRMED,
      });
      expect(mockAvailabilityService.markSlotAsBooked).toHaveBeenCalledWith(slotId);
      expect(result).toEqual(bookingWithRelations);
    });

    it('should throw NotFoundException if customer not found', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(
        service.bookAlternativeSlot(customerId, slotId, duration)
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException if customer is not a customer type', async () => {
      const painter = {
        id: customerId,
        userType: UserType.PAINTER,
      };

      mockUserRepository.findOne.mockResolvedValue(painter);

      await expect(
        service.bookAlternativeSlot(customerId, slotId, duration)
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException if slot not found', async () => {
      const customer = {
        id: customerId,
        userType: UserType.CUSTOMER,
      };

      mockUserRepository.findOne.mockResolvedValue(customer);
      mockAvailabilityService.findSlotById.mockResolvedValue(null);

      await expect(
        service.bookAlternativeSlot(customerId, slotId, duration)
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException if slot is already booked', async () => {
      const customer = {
        id: customerId,
        userType: UserType.CUSTOMER,
      };

      const bookedSlot = {
        id: slotId,
        isBooked: true,
      };

      mockUserRepository.findOne.mockResolvedValue(customer);
      mockAvailabilityService.findSlotById.mockResolvedValue(bookedSlot);

      await expect(
        service.bookAlternativeSlot(customerId, slotId, duration)
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException if duration exceeds available slot time', async () => {
      const customer = {
        id: customerId,
        userType: UserType.CUSTOMER,
      };

      const slot = {
        id: slotId,
        painterId: 'painter-id',
        startTime: new Date('2025-05-18T10:00:00Z'),
        endTime: new Date('2025-05-18T11:00:00Z'), // Only 1 hour available
        isBooked: false,
      };

      const longDuration = 2 * 60 * 60 * 1000; // 2 hours

      mockUserRepository.findOne.mockResolvedValue(customer);
      mockAvailabilityService.findSlotById.mockResolvedValue(slot);

      await expect(
        service.bookAlternativeSlot(customerId, slotId, longDuration)
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw NotFoundException if booking not found after creation', async () => {
      const customer = {
        id: customerId,
        userType: UserType.CUSTOMER,
      };

      const slot = {
        id: slotId,
        painterId: 'painter-id',
        startTime: new Date('2025-05-18T10:00:00Z'),
        endTime: new Date('2025-05-18T16:00:00Z'),
        isBooked: false,
      };

      const savedBooking = {
        id: 'booking-id',
        customerId,
        painterId: 'painter-id',
        availabilitySlotId: slotId,
        startTime: slot.startTime,
        endTime: new Date(slot.startTime.getTime() + duration),
        status: BookingStatus.CONFIRMED,
      };

      mockUserRepository.findOne.mockResolvedValue(customer);
      mockAvailabilityService.findSlotById.mockResolvedValue(slot);
      mockBookingRepository.create.mockReturnValue(savedBooking);
      mockBookingRepository.save.mockResolvedValue(savedBooking);
      mockBookingRepository.findOne.mockResolvedValue(null);

      await expect(
        service.bookAlternativeSlot(customerId, slotId, duration)
      ).rejects.toThrow(NotFoundException);
    });
  });
});
