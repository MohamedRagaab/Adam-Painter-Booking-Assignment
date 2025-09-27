import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';

export enum BookingStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  CANCELLED = 'cancelled',
}

@Entity('bookings')
export class Booking {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  customerId: string;

  @ManyToOne(() => User, (user) => user.customerBookings, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'customerId' })
  customer: User;

  @Column('uuid')
  painterId: string;

  @ManyToOne(() => User, (user) => user.painterBookings, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'painterId' })
  painter: User;

  @Column('uuid', { nullable: true })
  availabilitySlotId?: string;

  @ManyToOne('AvailabilitySlot', 'bookings')
  @JoinColumn({ name: 'availabilitySlotId' })
  availabilitySlot?: any;

  @Column('timestamptz', { name: 'start_time' })
  startTime: Date;

  @Column('timestamptz', { name: 'end_time' })
  endTime: Date;

  @Column({
    type: 'enum',
    enum: BookingStatus,
    default: BookingStatus.PENDING,
  })
  status: BookingStatus;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  get duration(): number {
    return this.endTime.getTime() - this.startTime.getTime();
  }

  get durationHours(): number {
    return this.duration / (1000 * 60 * 60);
  }
}
