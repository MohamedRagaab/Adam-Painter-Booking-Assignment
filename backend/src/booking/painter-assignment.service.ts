import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { AvailabilitySlot } from '../entities/availability-slot.entity';
import { Booking, BookingStatus } from '../entities/booking.entity';

export interface PainterSelectionCriteria {
  ratingWeight?: number;
  experienceWeight?: number;
  proximityWeight?: number;
  responseTimeWeight?: number;
}

@Injectable()
export class PainterAssignmentService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Booking)
    private bookingRepository: Repository<Booking>,
  ) {}

  async findBestPainter(
    availableSlots: AvailabilitySlot[],
    criteria: PainterSelectionCriteria = {},
  ): Promise<AvailabilitySlot> {
    if (availableSlots.length === 0) {
      throw new Error('No available painters');
    }

    if (availableSlots.length === 1) {
      return availableSlots[0];
    }

    // For now, implement simple selection based on earliest availability
    // In a real system, this would include painter ratings, experience, etc.
    const scoredSlots = await Promise.all(
      availableSlots.map(async (slot) => ({
        slot,
        score: await this.calculatePainterScore(slot.painter, criteria),
      })),
    );

    // Sort by score descending, then by earliest start time
    scoredSlots.sort((a, b) => {
      if (b.score !== a.score) {
        return b.score - a.score;
      }
      return a.slot.startTime.getTime() - b.slot.startTime.getTime();
    });

    return scoredSlots[0].slot;
  }

  private async calculatePainterScore(
    painter: User,
    criteria: PainterSelectionCriteria,
  ): Promise<number> {
    let score = 0;

    // Base score for being available
    score += 10;

    // Calculate experience score based on account age
    const accountAgeMonths = this.getAccountAgeInMonths(painter.createdAt);
    score += Math.min(accountAgeMonths * 0.5, 5); // Max 5 points for experience

    // Calculate completion rate score
    const completionRate = await this.getPainterCompletionRate(painter.id);
    score += completionRate * 5; // Max 5 points for completion rate

    // Calculate response time score (simplified)
    const avgResponseTime = await this.getAverageResponseTime(painter.id);
    if (avgResponseTime < 2) score += 3; // Fast responder
    else if (avgResponseTime < 6) score += 2; // Moderate responder
    else score += 1; // Slower responder

    return score;
  }

  private getAccountAgeInMonths(createdAt: Date): number {
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - createdAt.getTime());
    const diffMonths = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 30));
    return diffMonths;
  }

  private async getPainterCompletionRate(painterId: string): Promise<number> {
    const totalBookings = await this.bookingRepository.count({
      where: { painterId },
    });

    if (totalBookings === 0) return 0.5; // Neutral score for new painters

    const completedBookings = await this.bookingRepository.count({
      where: { painterId, status: BookingStatus.CONFIRMED },
    });

    return completedBookings / totalBookings;
  }

  private async getAverageResponseTime(painterId: string): Promise<number> {
    // Simplified - in a real system, this would track actual response times
    // For now, return a random value between 1-8 hours
    return Math.random() * 7 + 1;
  }

  async findAlternativeSlots(
    requestedStart: Date,
    requestedEnd: Date,
    windowHours: number = 24,
  ): Promise<AvailabilitySlot[]> {
    const duration = requestedEnd.getTime() - requestedStart.getTime();
    const searchStart = new Date(requestedStart.getTime() - windowHours * 60 * 60 * 1000);
    const searchEnd = new Date(requestedEnd.getTime() + windowHours * 60 * 60 * 1000);

    // Find slots that can accommodate the requested duration
    const alternatives = await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.availabilitySlots', 'slot')
      .leftJoinAndSelect('slot.painter', 'painter')
      .where('user.userType = :userType', { userType: 'painter' })
      .andWhere('slot.isBooked = :isBooked', { isBooked: false })
      .andWhere('slot.startTime >= :searchStart', { searchStart })
      .andWhere('slot.endTime <= :searchEnd', { searchEnd })
      .andWhere('(slot.endTime - slot.startTime) >= :duration', { duration })
      .orderBy('ABS(EXTRACT(EPOCH FROM slot.startTime) - EXTRACT(EPOCH FROM :requestedStart::timestamp))')
      .setParameter('requestedStart', requestedStart)
      .getMany();

    // Extract availability slots and sort by proximity to requested time
    const slots = alternatives
      .flatMap(user => user.availabilitySlots)
      .filter(slot => slot && !slot.isBooked)
      .sort((a, b) => {
        const aProximity = Math.abs(a.startTime.getTime() - requestedStart.getTime());
        const bProximity = Math.abs(b.startTime.getTime() - requestedStart.getTime());
        return aProximity - bProximity;
      });

    return slots.slice(0, 5); // Return top 5 alternatives
  }
}
