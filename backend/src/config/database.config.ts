import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { User } from '../entities/user.entity';
import { AvailabilitySlot } from '../entities/availability-slot.entity';
import { Booking } from '../entities/booking.entity';

export const getDatabaseConfig = (configService: ConfigService): TypeOrmModuleOptions => ({
  type: 'postgres',
  url: configService.get<string>('DATABASE_URL'),
  entities: [User, AvailabilitySlot, Booking],
  synchronize: false,
  logging: configService.get<string>('NODE_ENV') === 'development',
  ssl: configService.get<string>('NODE_ENV') === 'production' ? { rejectUnauthorized: false } : false,
});
