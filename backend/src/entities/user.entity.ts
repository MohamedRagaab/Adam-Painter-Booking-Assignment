import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Exclude } from 'class-transformer';

export enum UserType {
  PAINTER = 'painter',
  CUSTOMER = 'customer',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column({ name: 'password_hash' })
  @Exclude()
  passwordHash: string;

  @Column({
    type: 'enum',
    enum: UserType,
    name: 'user_type',
  })
  userType: UserType;

  @Column({ name: 'first_name' })
  firstName: string;

  @Column({ name: 'last_name' })
  lastName: string;

  @Column({ nullable: true, name: 'phone_number' })
  phoneNumber?: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany('AvailabilitySlot', 'painter')
  availabilitySlots: any[];

  @OneToMany('Booking', 'customer')
  customerBookings: any[];

  @OneToMany('Booking', 'painter')
  painterBookings: any[];

  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }
}
