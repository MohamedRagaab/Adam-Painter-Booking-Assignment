# Painter Booking System

A comprehensive full-stack application for booking painting services built with modern technologies including NestJS, React, PostgreSQL, and Docker. The system features automated painter assignment, smart scheduling, and intuitive interfaces for both painters and customers.

## 🎨 Features

### Features Demo

#### Painter Adding Availability Slots
![Painter Adding Availability Slot Demo](https://github.com/user-attachments/assets/d982efa4-90f8-4707-8758-ca195e32ff17)

#### Customer Adding a Booking Request
![Customer Adding Booking Request Demo](https://github.com/user-attachments/assets/d8abcb25-8c0a-4c7f-bcab-b31299620e33)

### Core Functionality
- **Painter Management**: Painters can add and manage their availability slots
- **Customer Booking**: Customers can request painting services for specific time windows
- **Automated Assignment**: System automatically assigns the best available painter using intelligent algorithms
- **Smart Recommendations**: Suggests alternative time slots when preferred time is unavailable
- **Real-time Updates**: Immediate feedback on booking status and availability

### User Roles
- **Painters**: Create availability slots, view assigned bookings, manage schedules
- **Customers**: Book services, view booking history, access alternative recommendations

### Frontend Pages & Routing
- **Authentication**: `/login`, `/register` - User authentication pages
- **Painter Dashboard**: `/painter/dashboard` - Painter-specific interface for managing availability and bookings
- **Customer Dashboard**: `/customer/dashboard` - Customer interface for booking services
- **Bookings Management**: `/bookings` - Universal bookings page for both user types
- **Protected Routes**: Role-based access control with automatic redirects

### Business Logic
- **Intelligent Painter Selection**: Multi-criteria scoring system for optimal painter assignment
- **Overlap Prevention**: Automatic validation to prevent scheduling conflicts
- **Time Zone Support**: Full timestamp handling with timezone awareness
- **Booking Status Management**: Complete lifecycle management (pending, confirmed, cancelled)

### For Painters
1. Register as a painter
2. Add availability slots for future dates
3. View automatically assigned bookings
4. Monitor booking status and customer details

### For Customers
1. Register as a customer
2. Request bookings for specific time windows
3. Receive immediate confirmation or alternative suggestions
4. View booking history and status

### Smart Features
- **Automatic Painter Assignment**: Based on availability, experience, and response time
- **Alternative Slot Recommendations**: When requested time unavailable
- **Overlap Prevention**: Automatic validation of time conflicts
- **Real-time Updates**: Immediate feedback on all operations

## 🛠 Tech Stack

### Backend
- **NestJS 11**: Modern Node.js framework with TypeScript support
- **TypeScript 5.7**: Type-safe development with latest features
- **PostgreSQL 15**: Robust relational database with advanced features
- **TypeORM 0.3.27**: Object-relational mapping with entity relationships
- **JWT Authentication**: Secure token-based authentication with Passport.js
- **Swagger/OpenAPI**: Comprehensive API documentation
- **Bcrypt 6.0.0**: Secure password hashing
- **Class Validator**: Request validation and transformation
- **UUID**: Unique identifier generation

### Frontend
- **React 19**: Modern React with concurrent features
- **TypeScript**: Full type safety across the application
- **Vite 7**: Fast development server and build tool
- **Tailwind CSS 3.4**: Utility-first CSS framework for rapid UI development
- **React Router 7**: Client-side routing with protected routes
- **TanStack React Query 5**: Server state management and caching
- **React Hook Form 7**: Performant form handling with validation
- **Yup 1.7**: Schema validation for forms
- **Axios 1.12**: HTTP client with interceptors
- **React Hot Toast 2.6**: Beautiful toast notifications
- **Date-fns 4.1**: Date manipulation and formatting

### Infrastructure & DevOps
- **Docker**: Containerization for consistent environments
- **Docker Compose**: Multi-service orchestration
- **PostgreSQL**: Production-ready database with extensions
- **Nginx**: High-performance web server for frontend serving
- **Health Checks**: Container health monitoring
- **Multi-stage Builds**: Optimized Docker images

### Testing
- **Jest**: Comprehensive testing framework
- **Testing Library**: React component testing utilities
- **Supertest**: HTTP assertion testing
- **Coverage Reports**: Code coverage analysis

## 🚀 Quick Start

### Prerequisites
- **Docker & Docker Compose**: Required for containerized deployment
- **Node.js 18+**: Required for local development
- **Git**: Version control

### Production Deployment with Docker

1. **Clone the repository:**
```bash
git clone https://github.com/MohamedRagaab/Adam-Painter-Booking-Assignment.git
cd painter-booking-system
```

2. **Configure environment:**
```bash
# Create .env file with your production values
# The docker-compose.yml uses default values if .env is not present
```

3. **Start all services:**
```bash
docker-compose up -d
```

4. **Verify deployment:**
   - **Frontend**: http://localhost:3000
   - **Backend API**: http://localhost:3001
   - **API Documentation**: http://localhost:3001/api
   - **Database**: localhost:5432 (POSTGRES_USER:painter_user, POSTGRES_PASSWORD: painter_pass)

### Development Setup

#### Backend Development
```bash
cd backend
npm install
cp .env.example .env
# Configure your local database in .env
npm run start:dev
```

#### Frontend Development
```bash
cd frontend
npm install
npm run dev
```

#### Database Setup
```bash
# The database is automatically initialized with sample data
# Check backend/db/init/01-init.sql for sample users
```

## 📁 Project Architecture

```
painter-booking-system/
├── backend/                    # NestJS Backend Application
│   ├── src/
│   │   ├── auth/              # Authentication module (JWT, guards, decorators)
│   │   ├── availability/      # Availability management (CRUD operations)
│   │   ├── booking/           # Booking system & painter assignment
│   │   ├── entities/          # TypeORM entities (User, Booking, AvailabilitySlot)
│   │   ├── dto/               # Data transfer objects (validation schemas)
│   │   └── config/            # Configuration modules (database, etc.)
│   ├── db/init/               # Database initialization scripts
│   ├── test/                  # Backend test files
│   ├── dist/                  # Compiled TypeScript output
│   ├── Dockerfile             # Backend container definition
│   └── package.json
├── frontend/                   # React Frontend Application
│   ├── src/
│   │   ├── components/        # Reusable React components (Layout, ProtectedRoute)
│   │   ├── pages/             # Page components (Login, Register, Dashboards)
│   │   ├── contexts/          # React contexts (AuthContext)
│   │   ├── services/          # API service layer (API client)
│   │   ├── types/             # TypeScript type definitions
│   │   └── assets/            # Static assets
│   ├── public/                # Public static files
│   ├── nginx.conf             # Nginx configuration
│   ├── Dockerfile             # Frontend container definition
│   └── package.json
├── docker-compose.yml         # Service orchestration (PostgreSQL, Backend, Frontend)
├── README.md                  # This file
└── .gitignore                 # Git ignore patterns
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file with the following variables (optional - defaults are provided in docker-compose.yml):

```env
# Database Configuration
POSTGRES_DB=painter_booking
POSTGRES_USER=painter_user
POSTGRES_PASSWORD=painter_pass

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d

# Application Configuration
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

# Frontend Configuration
VITE_API_URL=http://localhost:3001
```

**Note**: The docker-compose.yml file includes default values for all environment variables, so creating a `.env` file is optional for basic setup.

### Database Schema

<img width="968" height="1117" alt="image" src="https://github.com/user-attachments/assets/8c0d63bc-e719-4579-97f2-36cd215a7032" />

The system uses PostgreSQL with the following main entities:
- **Users**: Painters and customers with role-based access
- **Availability Slots**: Time windows when painters are available
- **Bookings**: Confirmed appointments between customers and painters

Sample data is automatically loaded including:
- Painter accounts: `john.painter@example.com`, `jane.painter@example.com`
- Customer accounts: `bob.customer@example.com`, `alice.customer@example.com`
- Default password for all demo accounts: `password123`

## 🧪 Testing

### Backend Tests
```bash
cd backend
npm test                # Run all tests
npm run test:watch      # Watch mode
npm run test:cov        # Coverage report
npm run test:e2e        # End-to-end tests
```

### Frontend Tests
```bash
cd frontend
npm test                # Run all tests
npm run test:watch      # Watch mode
npm run test:coverage   # Coverage report
```

### API Testing
The API includes comprehensive Swagger documentation accessible at `/api` endpoint when running.

## 📚 API Documentation

### Authentication Endpoints
- `POST /auth/register` - User registration (supports both painters and customers)
- `POST /auth/login` - User authentication with JWT token response

### Availability Endpoints
- `POST /availability` - Create availability slot (Painters only)
- `GET /availability/me` - Get painter's own availability slots
- `GET /availability` - Get available slots with filtering options
- `DELETE /availability/:id` - Delete availability slot (Painters only)

### Booking Endpoints
- `POST /bookings` - Create booking request (Customers only)
- `GET /bookings/me` - Get user's bookings (role-based filtering)
- `GET /bookings/:id` - Get specific booking details
- `PATCH /bookings/:id/status` - Update booking status
- `POST /bookings/alternative/:slotId` - Book alternative slot (Customers only)

### Health Check
- `GET /` - Service health check endpoint

### Response Formats
All APIs return consistent JSON responses with proper error handling and status codes. The API includes comprehensive Swagger documentation accessible at `/api` endpoint.

## 🚀 Deployment

### Production Deployment

1. **Configure production environment:**
```bash
# Update .env with production values
NODE_ENV=production
DATABASE_URL=<production-database-url>
JWT_SECRET=<strong-production-secret>
```

2. **Deploy with Docker Compose:**
```bash
docker compose up -d
```

### Production Considerations
- Use strong JWT secrets
- Configure proper database backup strategies
- Set up SSL/TLS termination
- Implement monitoring and logging
- Use environment-specific configuration


## 🛡️ Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: Bcrypt for secure password storage
- **Role-based Access Control**: Separate permissions for painters and customers
- **Input Validation**: Comprehensive request validation
- **SQL Injection Prevention**: TypeORM query protection
- **XSS Protection**: React's built-in escaping

## 🐛 Troubleshooting

### Common Issues

1. **Database Connection Issues:**
   ```bash
   # Check PostgreSQL container
   docker logs painter-booking-db
   
   # Verify database is ready
   docker exec -it painter-booking-db pg_isready
   ```

2. **Frontend Build Issues:**
   ```bash
   # Clear node_modules and reinstall
   cd frontend
   rm -rf node_modules package-lock.json
   npm install
   ```

3. **Backend Compilation Issues:**
   ```bash
   # Clear dist and rebuild
   cd backend
   rm -rf dist
   npm run build
   ```

### Health Checks
All services include health checks accessible at:
- Backend: `GET /` - Returns service status
- Frontend: `GET /health` - Nginx health check
- Database: Automatic PostgreSQL health monitoring

## 📖 Documentation

- **Requirements**: `painter-booking-system-requirement.md` - BDD-style requirements
- **Architecture**: `painter-booking-system-HLD.md` - High-level design document
- **API Docs**: Available at `/api` endpoint when running
- **Database Schema**: See `backend/db/init/01-init.sql`
