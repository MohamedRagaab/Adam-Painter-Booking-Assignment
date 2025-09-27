import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
  Check,
  VersionColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity('availability_slots')
@Check('valid_time_range', '"end_time" > "start_time"')
export class AvailabilitySlot {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  painterId: string;

  @ManyToOne(() => User, (user) => user.availabilitySlots, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'painterId' })
  painter: User;

  @Column('timestamptz', { name: 'start_time' })
  startTime: Date;

  @Column('timestamptz', { name: 'end_time' })
  endTime: Date;

  @Column({ default: false, name: 'is_booked' })
  isBooked: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @OneToMany('Booking', 'availabilitySlot')
  bookings: any[];

  @VersionColumn()
  version: number;

  get duration(): number {
    return this.endTime.getTime() - this.startTime.getTime();
  }

  get durationHours(): number {
    return this.duration / (1000 * 60 * 60);
  }
}
