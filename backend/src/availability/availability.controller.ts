import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Query, 
  UseGuards,
  HttpStatus 
} from '@nestjs/common';
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiBearerAuth,
  ApiQuery 
} from '@nestjs/swagger';
import { AvailabilityService } from './availability.service';
import { 
  CreateAvailabilityDto, 
  AvailabilityResponseDto,
  FindAvailabilityQueryDto 
} from '../dto/availability.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles, GetUser } from '../auth/decorators';
import { UserType, User } from '../entities/user.entity';

@ApiTags('Availability')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('availability')
export class AvailabilityController {
  constructor(private availabilityService: AvailabilityService) {}

  @Post()
  @Roles(UserType.PAINTER)
  @ApiOperation({ summary: 'Add availability slot (Painter only)' })
  @ApiResponse({ 
    status: HttpStatus.CREATED, 
    description: 'Availability slot created successfully',
    type: AvailabilityResponseDto 
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid time range' })
  @ApiResponse({ status: HttpStatus.CONFLICT, description: 'Time slot overlaps with existing availability' })
  async createAvailability(
    @GetUser() user: User,
    @Body() createAvailabilityDto: CreateAvailabilityDto,
  ): Promise<AvailabilityResponseDto> {
    const slot = await this.availabilityService.createAvailability(
      user.id,
      createAvailabilityDto,
    );

    return {
      id: slot.id,
      painterId: slot.painterId,
      startTime: slot.startTime.toISOString(),
      endTime: slot.endTime.toISOString(),
      isBooked: slot.isBooked,
      createdAt: slot.createdAt.toISOString(),
    };
  }

  @Get('me')
  @Roles(UserType.PAINTER)
  @ApiOperation({ summary: 'Get painter\'s availability slots' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Painter availability slots retrieved successfully',
    type: [AvailabilityResponseDto] 
  })
  async getPainterAvailability(@GetUser() user: User): Promise<AvailabilityResponseDto[]> {
    const slots = await this.availabilityService.findPainterAvailability(user.id);

    return slots.map(slot => ({
      id: slot.id,
      painterId: slot.painterId,
      startTime: slot.startTime.toISOString(),
      endTime: slot.endTime.toISOString(),
      isBooked: slot.isBooked,
      createdAt: slot.createdAt.toISOString(),
    }));
  }

  @Get()
  @ApiOperation({ summary: 'Get available slots' })
  @ApiQuery({ name: 'start', required: false, example: '2025-05-18' })
  @ApiQuery({ name: 'end', required: false, example: '2025-05-19' })
  @ApiQuery({ name: 'painterId', required: false })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Available slots retrieved successfully',
    type: [AvailabilityResponseDto] 
  })
  async getAvailableSlots(@Query() query: FindAvailabilityQueryDto): Promise<AvailabilityResponseDto[]> {
    const slots = await this.availabilityService.findAvailableSlots(query);

    return slots.map(slot => ({
      id: slot.id,
      painterId: slot.painterId,
      startTime: slot.startTime.toISOString(),
      endTime: slot.endTime.toISOString(),
      isBooked: slot.isBooked,
      createdAt: slot.createdAt.toISOString(),
      painter: slot.painter ? {
        id: slot.painter.id,
        firstName: slot.painter.firstName,
        lastName: slot.painter.lastName,
        email: slot.painter.email,
      } : undefined,
    }));
  }
}

