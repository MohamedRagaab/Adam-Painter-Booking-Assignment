# Painter Booking System - Frontend

A modern React frontend application for the Painter Booking System. Built with React 19, TypeScript, Vite, and Tailwind CSS, providing an intuitive interface for both painters and customers to manage bookings and availability.

## 🎨 Features

### User Experience
- **Responsive Design**: Mobile-first design that works on all devices
- **Dark/Light Mode**: Automatic theme switching with system preferences
- **Real-time Updates**: Live booking status and availability updates
- **Intuitive Navigation**: Clean, modern interface with smooth transitions
- **Form Validation**: Real-time validation with helpful error messages
- **Toast Notifications**: Beautiful success and error notifications

### Role-based Interfaces
- **Painter Dashboard**: Manage availability, view assigned bookings, update schedules
- **Customer Dashboard**: Request bookings, view history, manage appointments
- **Authentication**: Secure login/logout with JWT token management
- **Protected Routes**: Role-based access control

### Smart Features
- **Alternative Recommendations**: When preferred time unavailable, system suggests alternatives
- **Calendar Integration**: Visual availability and booking management
- **Search & Filtering**: Find available slots by date, time, and location
- **Booking History**: Complete history of all bookings and status changes

## 🛠 Tech Stack

### Core Framework
- **React 19**: Latest React with concurrent features
- **TypeScript**: Full type safety across the application
- **Vite 7**: Lightning-fast development server and build tool

### UI & Styling
- **Tailwind CSS**: Utility-first CSS framework
- **Responsive Design**: Mobile-first approach
- **Custom Components**: Reusable, accessible components
- **Modern Animations**: Smooth transitions and micro-interactions

### State Management
- **React Query**: Server state management and caching
- **React Context**: Global state for authentication
- **Local State**: React hooks for component state

### Forms & Validation
- **React Hook Form**: Performant form handling
- **Yup**: Schema validation for forms
- **Real-time Validation**: Instant feedback on form inputs

### Routing & Navigation
- **React Router 7**: Client-side routing with protected routes
- **Route Guards**: Authentication-based route protection
- **Dynamic Imports**: Code splitting for better performance

### HTTP & API
- **Axios**: HTTP client with interceptors
- **Request/Response Interceptors**: Automatic token handling
- **Error Handling**: Comprehensive error management

### Development Tools
- **ESLint**: Code linting with React-specific rules
- **Jest**: Testing framework with React Testing Library
- **TypeScript**: Strict type checking
- **Hot Module Replacement**: Instant development feedback

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/              # Reusable components
│   │   ├── Layout.tsx           # Main layout wrapper
│   │   └── ProtectedRoute.tsx   # Route protection
│   ├── contexts/                # React contexts
│   │   └── AuthContext.tsx      # Authentication context
│   ├── pages/                   # Page components
│   │   ├── LoginPage.tsx        # Authentication page
│   │   ├── DashboardPage.tsx    # Main dashboard
│   │   ├── BookingPage.tsx      # Booking management
│   │   ├── AvailabilityPage.tsx # Availability management
│   │   └── ProfilePage.tsx      # User profile
│   ├── services/                # API service layer
│   │   ├── api.ts               # Axios configuration
│   │   └── auth.ts              # Authentication services
│   ├── types/                   # TypeScript definitions
│   │   └── index.ts             # Shared type definitions
│   ├── hooks/                   # Custom React hooks
│   ├── utils/                   # Utility functions
│   ├── App.jsx                  # Main app component
│   ├── App.css                  # Global styles
│   ├── main.jsx                 # Application entry point
│   └── index.css                # Tailwind CSS imports
├── public/                      # Static assets
├── nginx.conf                   # Nginx configuration
├── Dockerfile                   # Container definition
├── tailwind.config.js           # Tailwind configuration
├── vite.config.js               # Vite configuration
└── package.json
```

## 🚀 Quick Start

### Prerequisites
- **Node.js 18+**
- **npm** or **yarn**
- **Backend API** running on port 3001

### Installation

1. **Clone and navigate to frontend:**
```bash
cd frontend
```

2. **Install dependencies:**
```bash
npm install
```

3. **Environment setup:**
```bash
# Create .env file
echo "VITE_API_URL=http://localhost:3001" > .env
```

4. **Start development server:**
```bash
npm run dev
```

5. **Open in browser:**
```
http://localhost:5173
```

### Environment Variables

Create a `.env` file with the following variables:

```env
# API Configuration
VITE_API_URL=http://localhost:3001

# Optional: Enable debug mode
VITE_DEBUG=true
```

## 🧪 Testing

### Run Tests
```bash
# Unit tests
npm test

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage
```

### Test Structure
- **Component Tests**: Individual component testing
- **Integration Tests**: Component interaction testing
- **User Interaction Tests**: User behavior simulation
- **Accessibility Tests**: Screen reader and keyboard navigation

## 🎨 UI Components

### Layout Components
- **Layout**: Main application wrapper with navigation
- **ProtectedRoute**: Authentication-based route protection
- **Header**: Navigation and user menu
- **Sidebar**: Role-based navigation menu

### Form Components
- **LoginForm**: User authentication form
- **BookingForm**: Booking request form
- **AvailabilityForm**: Availability slot creation
- **ProfileForm**: User profile management

### Data Display
- **BookingCard**: Individual booking display
- **AvailabilityCard**: Availability slot display
- **StatusBadge**: Booking status indicators
- **Calendar**: Visual date/time selection

### Feedback Components
- **Toast**: Success and error notifications
- **LoadingSpinner**: Loading state indicators
- **ErrorMessage**: Form validation errors
- **SuccessMessage**: Operation confirmations

## 🔧 Development

### Available Scripts

```bash
# Development
npm run dev              # Start development server
npm run build            # Build for production
npm run preview          # Preview production build

# Code Quality
npm run lint             # Run ESLint
npm run lint:fix         # Fix ESLint issues

# Testing
npm test                 # Run unit tests
npm run test:watch       # Run tests in watch mode
npm run test:coverage    # Generate coverage report
```

### Development Features
- **Hot Module Replacement**: Instant updates during development
- **TypeScript Checking**: Real-time type error detection
- **ESLint Integration**: Code quality enforcement
- **Prettier Formatting**: Consistent code formatting

## 🎯 User Flows

### Painter Workflow
1. **Login** → Painter dashboard
2. **Add Availability** → Create time slots
3. **View Bookings** → See assigned bookings
4. **Update Status** → Confirm or modify bookings
5. **Manage Profile** → Update personal information

### Customer Workflow
1. **Login** → Customer dashboard
2. **Request Booking** → Select time and details
3. **View Alternatives** → See suggested alternatives
4. **Confirm Booking** → Finalize appointment
5. **Track Status** → Monitor booking progress

### Authentication Flow
1. **Register** → Create new account
2. **Login** → Authenticate with credentials
3. **Role Detection** → Automatic dashboard routing
4. **Token Management** → Automatic refresh and logout

## 🎨 Design System

### Color Palette
- **Primary**: Blue tones for main actions
- **Secondary**: Gray tones for supporting elements
- **Success**: Green for positive actions
- **Warning**: Yellow for caution states
- **Error**: Red for error states

### Typography
- **Headings**: Bold, clear hierarchy
- **Body Text**: Readable, accessible font sizes
- **Code**: Monospace for technical content

### Spacing
- **Consistent**: 4px base unit for all spacing
- **Responsive**: Mobile-first spacing approach
- **Accessible**: Adequate touch targets and spacing

## 🐳 Docker Support

### Development with Docker
```bash
# Build and run with Docker Compose
docker-compose up -d

# View logs
docker-compose logs -f frontend
```

### Production Docker
```bash
# Build production image
docker build -t painter-booking-frontend .

# Run production container
docker run -p 3000:80 painter-booking-frontend
```

## 🔍 Features Deep Dive

### Smart Booking System
- **Time Slot Selection**: Visual calendar interface
- **Alternative Suggestions**: When preferred time unavailable
- **Real-time Availability**: Live updates from backend
- **Conflict Prevention**: Automatic validation

### Responsive Design
- **Mobile First**: Optimized for mobile devices
- **Tablet Support**: Enhanced tablet experience
- **Desktop**: Full desktop feature set
- **Touch Friendly**: Large touch targets

### Performance Optimizations
- **Code Splitting**: Lazy loading of routes
- **Image Optimization**: Optimized asset loading
- **Caching**: React Query for API caching
- **Bundle Analysis**: Optimized bundle sizes

## 🛡️ Security Features

- **JWT Token Management**: Secure token handling
- **Route Protection**: Authentication-based access
- **Input Sanitization**: XSS prevention
- **HTTPS Support**: Secure communication
- **Content Security Policy**: Additional security headers

## 🐛 Troubleshooting

### Common Issues

1. **API Connection Issues:**
```bash
# Check if backend is running
curl http://localhost:3001/

# Verify environment variables
echo $VITE_API_URL
```

2. **Build Issues:**
```bash
# Clear node_modules
rm -rf node_modules package-lock.json
npm install

# Clear Vite cache
rm -rf .vite
```

3. **TypeScript Errors:**
```bash
# Check TypeScript configuration
npx tsc --noEmit

# Update type definitions
npm install @types/react @types/react-dom
```

### Development Tips
- **Hot Reload**: Changes should appear instantly
- **Console Logs**: Check browser console for errors
- **Network Tab**: Monitor API requests in DevTools
- **React DevTools**: Use browser extension for debugging

## 📖 Documentation

- **Component Documentation**: Inline JSDoc comments
- **Type Definitions**: Full TypeScript support
- **API Integration**: Axios service documentation
- **State Management**: Context and hooks documentation

## 🤝 Contributing

1. **Fork the repository**
2. **Create feature branch**: `git checkout -b feature/amazing-feature`
3. **Write tests**: Ensure all tests pass
4. **Commit changes**: `git commit -m 'feat: add amazing feature'`
5. **Push to branch**: `git push origin feature/amazing-feature`
6. **Open Pull Request**

### Development Guidelines
- Follow React best practices
- Write tests for new components
- Use TypeScript for type safety
- Follow accessibility guidelines
- Ensure responsive design

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
1. Check the troubleshooting section
2. Review component documentation
3. Open an issue on the repository

---

**Built with ❤️ using React 19, TypeScript, and modern web technologies**