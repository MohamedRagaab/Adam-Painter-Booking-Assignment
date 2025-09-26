# Painter Booking System

A full-stack application for booking painting services built with NestJS, React, and Docker.

## Features

- **Painter Management**: Painters can add and manage their availability slots
- **Customer Booking**: Customers can request painting services for specific time windows
- **Automated Assignment**: System automatically assigns the best available painter
- **Smart Recommendations**: Suggests alternative time slots when preferred time is unavailable

## Tech Stack

### Backend
- NestJS
- TypeScript
- PostgreSQL
- TypeORM
- JWT Authentication

### Frontend
- React 18
- TypeScript
- Vite
- Tailwind CSS

### Infrastructure
- Docker
- Docker Compose
- PostgreSQL

## Quick Start

### Prerequisites
- Docker and Docker Compose
- Node.js 18+ (for local development without Docker)

### Development with Docker

1. Clone the repository:
```bash
git clone <repository-url>
cd painter-booking-system
```

2. Copy environment file:
```bash
cp .env.example .env
```

3. Start the services:
```bash
docker-compose up -d
```

4. Access the application:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001
   - PostgreSQL: localhost:5432

### Development without Docker

#### Backend Setup
```bash
cd backend
npm install
npm run start:dev
```

#### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

## Project Structure

```
painter-booking-system/
├── backend/          # NestJS backend application
├── frontend/         # React frontend application
├── docs/            # Documentation
├── docker-compose.yml # Docker composition
└── README.md        # This file
```

## API Documentation

Once running, API documentation will be available at:
- Swagger UI: http://localhost:3001/api

## Environment Variables

Copy `.env.example` to `.env` and configure:

```env
# Database
DATABASE_URL=postgresql://painter_user:painter_pass@localhost:5432/painter_booking

# JWT
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d

# Application
NODE_ENV=development
PORT=3001
```

## Development

### Running Tests
```bash
# Backend tests
cd backend
npm test

# Frontend tests  
cd frontend
npm test
```

### Database Migrations
```bash
cd backend
npm run typeorm migration:run
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT License
