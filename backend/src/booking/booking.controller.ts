import { 
  Controller, 
  Get, 
  Post, 
  Patch,
  Body, 
  Param,
  Query, 
  UseGuards,
  HttpStatus 
} from '@nestjs/common';
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiBearerAuth,
  ApiParam,
  ApiQuery 
} from '@nestjs/swagger';
import { BookingService } from './booking.service';
import { 
  CreateBookingDto, 
  BookingResponseDto,
  UpdateBookingStatusDto,
  BookingQueryDto,
  AlternativeSlotDto,
  BookingCreateResponseDto
} from '../dto/booking.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles, GetUser } from '../auth/decorators';
import { UserType, User } from '../entities/user.entity';

@ApiTags('Bookings')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('bookings')
export class BookingController {
  constructor(private bookingService: BookingService) {}

  @Post()
  @Roles(UserType.CUSTOMER)
  @ApiOperation({ summary: 'Create booking request (Customer only)' })
  @ApiResponse({ 
    status: HttpStatus.CREATED, 
    description: 'Booking created successfully or alternatives provided',
    type: BookingCreateResponseDto
  })
  @ApiResponse({ 
    status: HttpStatus.BAD_REQUEST, 
    description: 'Invalid booking request' 
  })
  async createBooking(
    @GetUser() user: User,
    @Body() createBookingDto: CreateBookingDto,
  ): Promise<BookingCreateResponseDto> {
    const result = await this.bookingService.createBooking(user.id, createBookingDto);

    if (result.booking) {
      const booking = result.booking;
      return {
        booking: {
          id: booking.id,
          customerId: booking.customerId,
          painterId: booking.painterId,
          startTime: booking.startTime.toISOString(),
          endTime: booking.endTime.toISOString(),
          status: booking.status,
          createdAt: booking.createdAt.toISOString(),
          updatedAt: booking.updatedAt.toISOString(),
          customer: booking.customer ? {
            id: booking.customer.id,
            firstName: booking.customer.firstName,
            lastName: booking.customer.lastName,
            email: booking.customer.email,
          } : undefined,
          painter: booking.painter ? {
            id: booking.painter.id,
            firstName: booking.painter.firstName,
            lastName: booking.painter.lastName,
            email: booking.painter.email,
          } : undefined,
          availabilitySlot: booking.availabilitySlot ? {
            id: booking.availabilitySlot.id,
            startTime: booking.availabilitySlot.startTime.toISOString(),
            endTime: booking.availabilitySlot.endTime.toISOString(),
          } : undefined,
        },
      };
    }

    return { alternatives: result.alternatives };
  }

  @Get('me')
  @ApiOperation({ summary: 'Get user\'s bookings' })
  @ApiQuery({ name: 'status', required: false, enum: ['pending', 'confirmed', 'cancelled'] })
  @ApiQuery({ name: 'startDate', required: false, example: '2025-05-18' })
  @ApiQuery({ name: 'endDate', required: false, example: '2025-05-19' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'User bookings retrieved successfully',
    type: [BookingResponseDto] 
  })
  async getUserBookings(
    @GetUser() user: User,
    @Query() query: BookingQueryDto,
  ): Promise<BookingResponseDto[]> {
    const bookings = await this.bookingService.findUserBookings(user.id, query);

    return bookings.map(booking => ({
      id: booking.id,
      customerId: booking.customerId,
      painterId: booking.painterId,
      startTime: booking.startTime.toISOString(),
      endTime: booking.endTime.toISOString(),
      status: booking.status,
      createdAt: booking.createdAt.toISOString(),
      updatedAt: booking.updatedAt.toISOString(),
      customer: booking.customer ? {
        id: booking.customer.id,
        firstName: booking.customer.firstName,
        lastName: booking.customer.lastName,
        email: booking.customer.email,
      } : undefined,
      painter: booking.painter ? {
        id: booking.painter.id,
        firstName: booking.painter.firstName,
        lastName: booking.painter.lastName,
        email: booking.painter.email,
      } : undefined,
      availabilitySlot: booking.availabilitySlot ? {
        id: booking.availabilitySlot.id,
        startTime: booking.availabilitySlot.startTime.toISOString(),
        endTime: booking.availabilitySlot.endTime.toISOString(),
      } : undefined,
    }));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get booking by ID' })
  @ApiParam({ name: 'id', description: 'Booking ID' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Booking details retrieved successfully',
    type: BookingResponseDto 
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Booking not found' })
  async getBookingById(
    @GetUser() user: User,
    @Param('id') bookingId: string,
  ): Promise<BookingResponseDto> {
    const booking = await this.bookingService.findBookingById(bookingId, user.id);

    return {
      id: booking.id,
      customerId: booking.customerId,
      painterId: booking.painterId,
      startTime: booking.startTime.toISOString(),
      endTime: booking.endTime.toISOString(),
      status: booking.status,
      createdAt: booking.createdAt.toISOString(),
      updatedAt: booking.updatedAt.toISOString(),
      customer: booking.customer ? {
        id: booking.customer.id,
        firstName: booking.customer.firstName,
        lastName: booking.customer.lastName,
        email: booking.customer.email,
      } : undefined,
      painter: booking.painter ? {
        id: booking.painter.id,
        firstName: booking.painter.firstName,
        lastName: booking.painter.lastName,
        email: booking.painter.email,
      } : undefined,
      availabilitySlot: booking.availabilitySlot ? {
        id: booking.availabilitySlot.id,
        startTime: booking.availabilitySlot.startTime.toISOString(),
        endTime: booking.availabilitySlot.endTime.toISOString(),
      } : undefined,
    };
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Update booking status' })
  @ApiParam({ name: 'id', description: 'Booking ID' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Booking status updated successfully',
    type: BookingResponseDto 
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Booking not found' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid status update' })
  async updateBookingStatus(
    @GetUser() user: User,
    @Param('id') bookingId: string,
    @Body() updateStatusDto: UpdateBookingStatusDto,
  ): Promise<BookingResponseDto> {
    const booking = await this.bookingService.updateBookingStatus(
      bookingId,
      updateStatusDto,
      user.id,
    );

    return {
      id: booking.id,
      customerId: booking.customerId,
      painterId: booking.painterId,
      startTime: booking.startTime.toISOString(),
      endTime: booking.endTime.toISOString(),
      status: booking.status,
      createdAt: booking.createdAt.toISOString(),
      updatedAt: booking.updatedAt.toISOString(),
    };
  }

  @Post('alternative/:slotId')
  @Roles(UserType.CUSTOMER)
  @ApiOperation({ summary: 'Book an alternative slot' })
  @ApiParam({ name: 'slotId', description: 'Alternative slot ID' })
  @ApiResponse({ 
    status: HttpStatus.CREATED, 
    description: 'Alternative slot booked successfully',
    type: BookingResponseDto 
  })
  async bookAlternativeSlot(
    @GetUser() user: User,
    @Param('slotId') slotId: string,
    @Body('duration') duration: number,
  ): Promise<BookingResponseDto> {
    const booking = await this.bookingService.bookAlternativeSlot(
      user.id,
      slotId,
      duration,
    );

    return {
      id: booking.id,
      customerId: booking.customerId,
      painterId: booking.painterId,
      startTime: booking.startTime.toISOString(),
      endTime: booking.endTime.toISOString(),
      status: booking.status,
      createdAt: booking.createdAt.toISOString(),
      updatedAt: booking.updatedAt.toISOString(),
      customer: booking.customer ? {
        id: booking.customer.id,
        firstName: booking.customer.firstName,
        lastName: booking.customer.lastName,
        email: booking.customer.email,
      } : undefined,
      painter: booking.painter ? {
        id: booking.painter.id,
        firstName: booking.painter.firstName,
        lastName: booking.painter.lastName,
        email: booking.painter.email,
      } : undefined,
    };
  }
}

