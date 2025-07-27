# Weather App

This project is a full-stack application that manages user locations using OpenWeatherMap API to fetch geographic data based on zip codes. The application is built using a modern stack with TypeScript, tRPC, React, and Firebase Realtime Database.

## Features Implemented

- ✅ Complete CRUD operations for user management
- ✅ Firebase Authentication with Email/Password
- ✅ Protected routes and authenticated API endpoints
- ✅ Firebase Realtime Database integration for real-time data updates
- ✅ Automatic fetching of geographic data (latitude, longitude, timezone) from OpenWeatherMap API
- ✅ Interactive map visualization of user locations using Google Maps
- ✅ Real-time updates across all connected clients
- ✅ Type-safe end-to-end API using tRPC
- ✅ Modern UI with dark mode support and animations
- ✅ Monorepo architecture for better code organization and sharing
- ✅ Automated deployment using GitHub Actions
- ✅ Backend deployed to Google Cloud Run
- ✅ Frontend deployed to Netlify

## Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS, Framer Motion
- **Backend**: Node.js, TypeScript, tRPC
- **Database**: Firebase Realtime Database
- **Authentication**: Firebase Authentication
- **APIs**: OpenWeatherMap API, Google Maps API
- **Build Tools**: Turborepo, Vite
- **Package Manager**: Bun
- **Deployment**: GitHub Actions, Google Cloud Run, Netlify

## How to Run

1. Clone the repository
```bash
git clone https://github.com/betiol/weather-app.git
cd weather-app
```

2. Install dependencies
```bash
bun install
```

3. Set up environment variables:

Create `.env` files in both `apps/api` and `apps/web` directories:

For `apps/api/.env`:
```env
PORT=your_app_port
OPENWEATHER_API_KEY=your_openweather_api_key
FIREBASE_PROJECT_ID=your_firebase_project_id
FIREBASE_PRIVATE_KEY=your_firebase_private_key
FIREBASE_CLIENT_EMAIL=your_firebase_client_email
FIREBASE_DATABASE_URL=your_firebase_database_url
```

For `apps/web/.env`:
```env
VITE_API_BASE_URL=your_api_base_url
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
VITE_FIREBASE_DATABASE_URL=your_firebase_database_url
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
VITE_FIREBASE_APP_ID=your_firebase_app_id
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

4. Start the development servers
```bash
bun dev
```

This will start both the API and web application in development mode. The web application will be available at `http://localhost:5173` and the API at `http://localhost:3000`.

## Live Deployment

The application is deployed and available online:

- **Frontend**: Deployed on Netlify with automatic deployment from the main branch
- **Backend**: Deployed on Google Cloud Run with containerized deployment
- **CI/CD**: GitHub Actions automatically builds and deploys both frontend and backend on every push to main

## Authentication

The application uses Firebase Authentication for secure user access:

- Email/Password authentication
- Protected routes using React Context
- Authenticated tRPC endpoints
- Secure session management
- Real-time authentication state updates

## Architecture Approach

### Why tRPC?

tRPC was chosen over traditional REST for several key benefits:

1. **Type Safety**: tRPC provides end-to-end type safety between the client and server without manual type synchronization or code generation.
2. **Developer Experience**: Automatic IntelliSense and type checking across the full stack.
3. **Performance**: Smaller bundle size and better performance compared to REST clients due to its minimal runtime.
4. **Real-time Capabilities**: Built-in support for subscriptions and real-time updates.

### Monorepo Structure

The project uses a monorepo architecture with Turborepo for several reasons:

1. **Code Sharing**: Shared types and utilities between frontend and backend.
2. **Consistent Development Experience**: Single command to run all services.
3. **Dependency Management**: Centralized package management and versioning.
4. **Build Performance**: Turborepo's intelligent build caching.

The project is organized into:
- `apps/api`: Backend tRPC server
- `apps/web`: React frontend application
- `packages/`: Shared code (types, utilities)

## Testing

The project includes several types of tests:

1. **Unit Tests**: Service layer testing using Jest
   - User service operations
   - Weather service integration
   - Firebase database operations
   - Authentication flows

2. **Integration Tests**: API endpoint testing
   - CRUD operations
   - Error handling
   - Data validation
   - Authentication middleware

3. **Manual Testing**:
   - Cross-browser compatibility
   - Responsive design
   - Real-time updates
   - Map interaction
   - Form validation
   - Authentication flows
   - Session management

## Assumptions Made

1. Users are identified by unique IDs generated by Firebase
2. Zip codes are assumed to be US-based for OpenWeatherMap API
3. All users have valid zip codes that can be geocoded
4. Google Maps API is used for visualization only
5. Real-time updates are required for collaborative features
6. Email/Password is sufficient for authentication needs
