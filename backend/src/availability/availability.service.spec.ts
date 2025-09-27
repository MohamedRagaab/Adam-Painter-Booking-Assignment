import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BadRequestException, NotFoundException, ConflictException } from '@nestjs/common';
import { AvailabilityService } from './availability.service';
import { AvailabilitySlot } from '../entities/availability-slot.entity';
import { User, UserType } from '../entities/user.entity';

describe('AvailabilityService', () => {
  let service: AvailabilityService;
  let availabilityRepository: Repository<AvailabilitySlot>;
  let userRepository: Repository<User>;

  const mockAvailabilityRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    createQueryBuilder: jest.fn(),
    update: jest.fn(),
  };

  const mockUserRepository = {
    findOne: jest.fn(),
    createQueryBuilder: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AvailabilityService,
        {
          provide: getRepositoryToken(AvailabilitySlot),
          useValue: mockAvailabilityRepository,
        },
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<AvailabilityService>(AvailabilityService);
    availabilityRepository = module.get<Repository<AvailabilitySlot>>(
      getRepositoryToken(AvailabilitySlot),
    );
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));

    jest.clearAllMocks();
  });

  describe('createAvailability', () => {
    const painterId = 'painter-id';
    const createAvailabilityDto = {
      startTime: '2025-05-18T10:00:00Z',
      endTime: '2025-05-18T14:00:00Z',
    };

    it('should successfully create availability slot', async () => {
      const painter = {
        id: painterId,
        userType: UserType.PAINTER,
      };
      const savedSlot = {
        id: 'slot-id',
        painterId,
        startTime: new Date(createAvailabilityDto.startTime),
        endTime: new Date(createAvailabilityDto.endTime),
      };

      mockUserRepository.findOne.mockResolvedValue(painter);
      mockAvailabilityRepository.findOne.mockResolvedValue(null);
      mockAvailabilityRepository.create.mockReturnValue(savedSlot);
      mockAvailabilityRepository.save.mockResolvedValue(savedSlot);

      const result = await service.createAvailability(painterId, createAvailabilityDto);

      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { id: painterId, userType: UserType.PAINTER },
      });
      expect(mockAvailabilityRepository.create).toHaveBeenCalledWith({
        painterId,
        startTime: new Date(createAvailabilityDto.startTime),
        endTime: new Date(createAvailabilityDto.endTime),
      });
      expect(result).toEqual(savedSlot);
    });

    it('should throw NotFoundException if painter not found', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(
        service.createAvailability(painterId, createAvailabilityDto),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException if end time is before start time', async () => {
      const painter = { id: painterId, userType: UserType.PAINTER };
      const invalidDto = {
        startTime: '2025-05-18T14:00:00Z',
        endTime: '2025-05-18T10:00:00Z',
      };

      mockUserRepository.findOne.mockResolvedValue(painter);

      await expect(
        service.createAvailability(painterId, invalidDto),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException if trying to create availability in the past', async () => {
      const painter = { id: painterId, userType: UserType.PAINTER };
      const pastDto = {
        startTime: '2020-05-18T10:00:00Z',
        endTime: '2020-05-18T14:00:00Z',
      };

      mockUserRepository.findOne.mockResolvedValue(painter);

      await expect(
        service.createAvailability(painterId, pastDto),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw ConflictException if time slot overlaps', async () => {
      const painter = { id: painterId, userType: UserType.PAINTER };
      const overlappingSlot = { id: 'existing-slot' };

      mockUserRepository.findOne.mockResolvedValue(painter);
      mockAvailabilityRepository.findOne.mockResolvedValue(overlappingSlot);

      await expect(
        service.createAvailability(painterId, createAvailabilityDto),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('findPainterAvailability', () => {
    it('should return painter availability slots', async () => {
      const painterId = 'painter-id';
      const slots = [
        { id: 'slot1', painterId },
        { id: 'slot2', painterId },
      ];

      mockAvailabilityRepository.find.mockResolvedValue(slots);

      const result = await service.findPainterAvailability(painterId);

      expect(mockAvailabilityRepository.find).toHaveBeenCalledWith({
        where: { painterId },
        relations: ['painter'],
        order: { startTime: 'ASC' },
      });
      expect(result).toEqual(slots);
    });
  });

  describe('markSlotAsBooked', () => {
    it('should mark slot as booked', async () => {
      const slotId = 'slot-id';

      await service.markSlotAsBooked(slotId);

      expect(mockAvailabilityRepository.update).toHaveBeenCalledWith(slotId, {
        isBooked: true,
      });
    });
  });
});

