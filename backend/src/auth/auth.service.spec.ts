import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { AuthService } from './auth.service';
import { User, UserType } from '../entities/user.entity';

describe('AuthService', () => {
  let service: AuthService;
  let userRepository: Repository<User>;
  let jwtService: JwtService;

  const mockUserRepository = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    jwtService = module.get<JwtService>(JwtService);

    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  describe('register', () => {
    const registerDto = {
      email: 'test@example.com',
      password: 'password123',
      userType: UserType.PAINTER,
      firstName: 'John',
      lastName: 'Doe',
    };

    it('should successfully register a new user', async () => {
      const hashedPassword = 'hashedPassword';
      const savedUser = {
        id: '1',
        ...registerDto,
        passwordHash: hashedPassword,
      };
      const accessToken = 'access-token';

      mockUserRepository.findOne.mockResolvedValue(null);
      jest.spyOn(bcrypt, 'genSalt').mockResolvedValue('salt' as never);
      jest.spyOn(bcrypt, 'hash').mockResolvedValue(hashedPassword as never);
      mockUserRepository.create.mockReturnValue(savedUser);
      mockUserRepository.save.mockResolvedValue(savedUser);
      mockJwtService.sign.mockReturnValue(accessToken);

      const result = await service.register(registerDto);

      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { email: registerDto.email },
      });
      expect(mockUserRepository.create).toHaveBeenCalledWith({
        ...registerDto,
        passwordHash: hashedPassword,
      });
      expect(mockUserRepository.save).toHaveBeenCalledWith(savedUser);
      expect(mockJwtService.sign).toHaveBeenCalledWith({
        sub: savedUser.id,
        email: savedUser.email,
        userType: savedUser.userType,
      });
      expect(result).toEqual({
        accessToken,
        user: {
          id: savedUser.id,
          email: savedUser.email,
          userType: savedUser.userType,
          firstName: savedUser.firstName,
          lastName: savedUser.lastName,
          phoneNumber: savedUser.phoneNumber,
        },
      });
    });

    it('should throw ConflictException if user already exists', async () => {
      mockUserRepository.findOne.mockResolvedValue({ id: '1' });

      await expect(service.register(registerDto)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('login', () => {
    const loginDto = {
      email: 'test@example.com',
      password: 'password123',
    };

    it('should successfully login with valid credentials', async () => {
      const user = {
        id: '1',
        email: loginDto.email,
        passwordHash: 'hashedPassword',
        userType: UserType.PAINTER,
        firstName: 'John',
        lastName: 'Doe',
      };
      const accessToken = 'access-token';

      mockUserRepository.findOne.mockResolvedValue(user);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as never);
      mockJwtService.sign.mockReturnValue(accessToken);

      const result = await service.login(loginDto);

      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { email: loginDto.email },
      });
      expect(bcrypt.compare).toHaveBeenCalledWith(
        loginDto.password,
        user.passwordHash,
      );
      expect(mockJwtService.sign).toHaveBeenCalledWith({
        sub: user.id,
        email: user.email,
        userType: user.userType,
      });
      expect(result).toEqual({
        accessToken,
        user: {
          id: user.id,
          email: user.email,
          userType: user.userType,
          firstName: user.firstName,
          lastName: user.lastName,
          phoneNumber: user.phoneNumber,
        },
      });
    });

    it('should throw UnauthorizedException if user not found', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(service.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw UnauthorizedException if password is invalid', async () => {
      const user = {
        id: '1',
        email: loginDto.email,
        passwordHash: 'hashedPassword',
      };

      mockUserRepository.findOne.mockResolvedValue(user);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false as never);

      await expect(service.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('validateUser', () => {
    it('should return user if found', async () => {
      const user = { id: '1', email: 'test@example.com' };
      mockUserRepository.findOne.mockResolvedValue(user);

      const result = await service.validateUser('1');

      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { id: '1' },
      });
      expect(result).toEqual(user);
    });

    it('should return null if user not found', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);

      const result = await service.validateUser('1');

      expect(result).toBeNull();
    });
  });
});

