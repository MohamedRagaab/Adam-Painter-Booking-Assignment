# Painter Booking System - Backend API

A robust NestJS backend API for a painter booking system that handles user authentication, availability management, and intelligent painter assignment. Built with TypeScript, PostgreSQL, and modern NestJS patterns.

## 🚀 Features

### Core Functionality
- **JWT Authentication**: Secure token-based authentication with role-based access control
- **User Management**: Support for Painters and Customers with distinct permissions
- **Availability Management**: Painters can create and manage their availability slots
- **Intelligent Booking System**: Automated painter assignment with smart algorithms
- **Alternative Recommendations**: System suggests alternative time slots when preferred time is unavailable
- **Real-time Validation**: Prevents scheduling conflicts and validates booking requests

### API Endpoints
- **Authentication**: `/auth/register`, `/auth/login`
- **Availability**: `/availability` (CRUD operations for painters)
- **Bookings**: `/bookings` (Complete booking lifecycle management)
- **Health Check**: `/` (Service health monitoring)

## 🛠 Tech Stack

### Core Framework
- **NestJS 11**: Modern Node.js framework with TypeScript
- **TypeScript 5.7**: Full type safety and modern JavaScript features
- **Node.js 18+**: Runtime environment

### Database & ORM
- **PostgreSQL**: Robust relational database
- **TypeORM**: Advanced ORM with entity relationships
- **Database Migrations**: Automated schema management

### Authentication & Security
- **JWT**: JSON Web Tokens for stateless authentication
- **Passport.js**: Authentication strategies
- **Bcrypt**: Secure password hashing
- **Role-based Guards**: Fine-grained access control

### API Documentation
- **Swagger/OpenAPI**: Comprehensive API documentation
- **Class Validator**: Request validation and transformation
- **DTOs**: Type-safe data transfer objects

### Testing
- **Jest**: Comprehensive testing framework
- **Supertest**: HTTP assertion testing
- **Coverage Reports**: Code coverage analysis

## 📁 Project Structure

```
backend/
├── src/
│   ├── auth/                    # Authentication module
│   │   ├── auth.controller.ts   # Auth endpoints
│   │   ├── auth.service.ts      # Auth business logic
│   │   ├── jwt.strategy.ts      # JWT authentication strategy
│   │   ├── jwt-auth.guard.ts    # JWT guard implementation
│   │   ├── roles.guard.ts       # Role-based access control
│   │   └── decorators.ts        # Custom decorators
│   ├── availability/            # Availability management
│   │   ├── availability.controller.ts
│   │   ├── availability.service.ts
│   │   └── availability.module.ts
│   ├── booking/                 # Booking system
│   │   ├── booking.controller.ts
│   │   ├── booking.service.ts
│   │   ├── painter-assignment.service.ts  # Smart assignment logic
│   │   └── booking.module.ts
│   ├── entities/                # TypeORM entities
│   │   ├── user.entity.ts       # User model
│   │   ├── availability-slot.entity.ts
│   │   └── booking.entity.ts
│   ├── dto/                     # Data transfer objects
│   │   ├── auth.dto.ts
│   │   ├── availability.dto.ts
│   │   └── booking.dto.ts
│   ├── config/                  # Configuration
│   │   └── database.config.ts
│   ├── app.controller.ts        # Health check endpoint
│   ├── app.service.ts          # App service
│   ├── app.module.ts           # Root module
│   └── main.ts                 # Application bootstrap
├── db/init/                     # Database initialization
│   └── 01-init.sql             # Sample data
├── test/                        # E2E tests
├── dist/                        # Compiled output
├── Dockerfile                   # Container definition
└── package.json
```

## 🚀 Quick Start

### Prerequisites
- **Node.js 18+**
- **PostgreSQL 12+**
- **npm** or **yarn**

### Installation

1. **Clone and navigate to backend:**
```bash
cd backend
```

2. **Install dependencies:**
```bash
npm install
```

3. **Environment setup:**
```bash
cp ../env.example .env
# Edit .env with your database configuration
```

4. **Database setup:**
```bash
# Ensure PostgreSQL is running
# Create database: painter_booking
# The init script will create tables and sample data
```

5. **Start development server:**
```bash
npm run start:dev
```

### Environment Variables

Create a `.env` file with the following variables:

```env
# Database Configuration
DATABASE_URL=postgresql://username:password@localhost:5432/painter_booking
POSTGRES_DB=painter_booking
POSTGRES_USER=painter_user
POSTGRES_PASSWORD=painter_pass

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d

# Application Configuration
NODE_ENV=development
PORT=3001
FRONTEND_URL=http://localhost:3000
```

## 🧪 Testing

### Run Tests
```bash
# Unit tests
npm test

# Watch mode
npm run test:watch

# Coverage report
npm run test:cov

# E2E tests
npm run test:e2e
```

### Test Structure
- **Unit Tests**: Individual service and controller testing
- **Integration Tests**: Database and API integration
- **E2E Tests**: Complete user workflow testing

## 📚 API Documentation

### Authentication Endpoints

#### Register User
```http
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe",
  "userType": "CUSTOMER",
  "phoneNumber": "+1234567890"
}
```

#### Login User
```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

### Availability Endpoints

#### Create Availability Slot (Painters only)
```http
POST /availability
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "startTime": "2024-01-15T09:00:00Z",
  "endTime": "2024-01-15T17:00:00Z",
  "location": "123 Main St, City, State"
}
```

#### Get Painter's Availability
```http
GET /availability/me
Authorization: Bearer <jwt-token>
```

### Booking Endpoints

#### Create Booking Request
```http
POST /bookings
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "preferredStartTime": "2024-01-15T10:00:00Z",
  "preferredEndTime": "2024-01-15T14:00:00Z",
  "description": "Interior painting for living room",
  "location": "456 Oak Ave, City, State"
}
```

#### Get User's Bookings
```http
GET /bookings/me
Authorization: Bearer <jwt-token>
```

### Health Check
```http
GET /
# Returns: "Hello World!"
```

## 🔧 Development

### Available Scripts

```bash
# Development
npm run start:dev          # Start with hot reload
npm run start:debug       # Start with debugging

# Building
npm run build             # Compile TypeScript
npm run start:prod       # Start production build

# Code Quality
npm run lint              # Run ESLint
npm run format            # Format code with Prettier

# Testing
npm test                  # Run unit tests
npm run test:watch        # Run tests in watch mode
npm run test:cov          # Generate coverage report
npm run test:e2e          # Run end-to-end tests
```

### Code Style
- **ESLint**: Code linting with TypeScript support
- **Prettier**: Code formatting
- **TypeScript**: Strict type checking
- **Conventional Commits**: Standardized commit messages

## 🐳 Docker Support

### Development with Docker
```bash
# Build and run with Docker Compose
docker-compose up -d

# View logs
docker-compose logs -f backend
```

### Production Docker
```bash
# Build production image
docker build -t painter-booking-backend .

# Run production container
docker run -p 3001:3001 painter-booking-backend
```

## 🔍 API Features

### Smart Painter Assignment
The system uses intelligent algorithms to assign painters based on:
- **Availability**: Matching time slots
- **Location**: Proximity to customer
- **Experience**: Painter rating and history
- **Response Time**: Quick assignment processing

### Alternative Slot Recommendations
When preferred time is unavailable:
- **Time-based suggestions**: Nearby time slots
- **Painter alternatives**: Other available painters
- **Flexible scheduling**: Multiple options for customers

### Real-time Validation
- **Overlap prevention**: Automatic conflict detection
- **Time zone handling**: Proper timestamp management
- **Input validation**: Comprehensive request validation

## 🛡️ Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: Bcrypt for secure password storage
- **Role-based Access**: Separate permissions for painters and customers
- **Input Validation**: Class-validator for request validation
- **SQL Injection Prevention**: TypeORM query protection
- **CORS Configuration**: Proper cross-origin resource sharing

## 🐛 Troubleshooting

### Common Issues

1. **Database Connection Issues:**
```bash
# Check PostgreSQL status
pg_isready -h localhost -p 5432

# Verify database exists
psql -h localhost -U painter_user -d painter_booking
```

2. **Port Already in Use:**
```bash
# Find process using port 3001
lsof -i :3001

# Kill process
kill -9 <PID>
```

3. **TypeScript Compilation Issues:**
```bash
# Clear dist folder
rm -rf dist

# Rebuild
npm run build
```

### Health Checks
- **Service Health**: `GET /` - Returns service status
- **Database Health**: Automatic connection monitoring
- **JWT Validation**: Token verification on protected routes

## 📖 Documentation

- **API Documentation**: Available at `/api` when running
- **Swagger UI**: Interactive API documentation
- **Type Definitions**: Full TypeScript support
- **Entity Relationships**: Database schema documentation

## 🤝 Contributing

1. **Fork the repository**
2. **Create feature branch**: `git checkout -b feature/amazing-feature`
3. **Write tests**: Ensure all tests pass
4. **Commit changes**: `git commit -m 'feat: add amazing feature'`
5. **Push to branch**: `git push origin feature/amazing-feature`
6. **Open Pull Request**

### Development Guidelines
- Follow TypeScript best practices
- Write tests for new features
- Update API documentation
- Use conventional commit messages
- Ensure all health checks pass

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
1. Check the troubleshooting section
2. Review API documentation at `/api`
3. Open an issue on the repository

---

**Built with ❤️ using NestJS and modern TypeScript practices**