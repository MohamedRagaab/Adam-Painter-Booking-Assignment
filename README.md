# Painter Booking System

A comprehensive full-stack application for booking painting services built with modern technologies including NestJS, React, PostgreSQL, and Docker. The system features automated painter assignment, smart scheduling, and intuitive interfaces for both painters and customers.

## 🎨 Features

### Core Functionality
- **Painter Management**: Painters can add and manage their availability slots
- **Customer Booking**: Customers can request painting services for specific time windows
- **Automated Assignment**: System automatically assigns the best available painter using intelligent algorithms
- **Smart Recommendations**: Suggests alternative time slots when preferred time is unavailable
- **Real-time Updates**: Immediate feedback on booking status and availability

### User Roles
- **Painters**: Create availability slots, view assigned bookings, manage schedules
- **Customers**: Book services, view booking history, access alternative recommendations

### Business Logic
- **Intelligent Painter Selection**: Multi-criteria scoring system for optimal painter assignment
- **Overlap Prevention**: Automatic validation to prevent scheduling conflicts
- **Time Zone Support**: Full timestamp handling with timezone awareness
- **Booking Status Management**: Complete lifecycle management (pending, confirmed, cancelled)

## 🛠 Tech Stack

### Backend
- **NestJS**: Modern Node.js framework with TypeScript support
- **TypeScript**: Type-safe development
- **PostgreSQL**: Robust relational database with advanced features
- **TypeORM**: Object-relational mapping with entity relationships
- **JWT Authentication**: Secure token-based authentication
- **Swagger/OpenAPI**: Comprehensive API documentation
- **Bcrypt**: Secure password hashing
- **Class Validator**: Request validation and transformation

### Frontend
- **React 18**: Modern React with concurrent features
- **TypeScript**: Full type safety across the application
- **Vite**: Fast development server and build tool
- **Tailwind CSS**: Utility-first CSS framework for rapid UI development
- **React Router**: Client-side routing with protected routes
- **React Query**: Server state management and caching
- **React Hook Form**: Performant form handling with validation
- **Yup**: Schema validation for forms
- **Axios**: HTTP client with interceptors
- **React Hot Toast**: Beautiful toast notifications
- **Date-fns**: Date manipulation and formatting

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
git clone <repository-url>
cd painter-booking-system
```

2. **Configure environment:**
```bash
cp env.example .env
# Edit .env file with your production values
```

3. **Start all services:**
```bash
docker-compose up -d
```

4. **Verify deployment:**
   - **Frontend**: http://localhost:3000
   - **Backend API**: http://localhost:3001
   - **API Documentation**: http://localhost:3001/api
   - **Database**: localhost:5432

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
│   │   ├── auth/              # Authentication module
│   │   ├── availability/      # Availability management
│   │   ├── booking/           # Booking system & painter assignment
│   │   ├── entities/          # TypeORM entities
│   │   ├── dto/               # Data transfer objects
│   │   └── config/            # Configuration modules
│   ├── db/init/               # Database initialization scripts
│   ├── Dockerfile             # Backend container definition
│   └── package.json
├── frontend/                   # React Frontend Application
│   ├── src/
│   │   ├── components/        # Reusable React components
│   │   ├── pages/             # Page components
│   │   ├── contexts/          # React contexts (Auth, etc.)
│   │   ├── services/          # API service layer
│   │   ├── types/             # TypeScript type definitions
│   │   └── hooks/             # Custom React hooks
│   ├── nginx.conf             # Nginx configuration
│   ├── Dockerfile             # Frontend container definition
│   └── package.json
├── docker-compose.yml         # Service orchestration
├── env.example                # Environment template
├── painter-booking-system-requirement.md  # BDD Requirements
├── painter-booking-system-HLD.md         # High-Level Design
└── README.md                  # This file
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file from `env.example` and configure:

```env
# Database Configuration
DATABASE_URL=postgresql://painter_user:painter_pass@postgres:5432/painter_booking
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

# Frontend Configuration
VITE_API_URL=http://localhost:3001
```

### Database Schema

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
- `POST /auth/register` - User registration
- `POST /auth/login` - User authentication

### Availability Endpoints
- `POST /availability` - Create availability slot (Painters only)
- `GET /availability/me` - Get painter's availability
- `GET /availability` - Get available slots (with filtering)

### Booking Endpoints
- `POST /bookings` - Create booking request
- `GET /bookings/me` - Get user's bookings
- `GET /bookings/:id` - Get specific booking
- `PATCH /bookings/:id/status` - Update booking status
- `POST /bookings/alternative/:slotId` - Book alternative slot

### Response Formats
All APIs return consistent JSON responses with proper error handling and status codes.

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

## 🔍 Features Demo

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

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit changes**: `git commit -m 'Add amazing feature'`
4. **Push to branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### Development Guidelines
- Follow TypeScript best practices
- Write tests for new features
- Update documentation as needed
- Use conventional commit messages
- Ensure all health checks pass

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
1. Check the troubleshooting section above
2. Review the API documentation at `/api`
3. Examine the requirements and design documents
4. Open an issue on the repository

---

**Built with ❤️ using modern web technologies**
