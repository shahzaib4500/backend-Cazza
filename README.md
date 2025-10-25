# Minimal Express + Supabase + JWT backend

This repo contains a small, human-friendly backend using:

- Express
- Supabase (as database)
- JSON Web Tokens (JWT) for authentication

Essentials only: model/controller/routes/middleware organization.

Environment variables (create a `.env` in project root):

- SUPABASE_URL=https://your-project.supabase.co
- SUPABASE_KEY=your-service-role-or-rest-key
- JWT_SECRET=some-long-secret
- PORT=3000 (optional)

Database table expected: `users` with columns:

- id (uuid primary key)
- email (text, unique)
- password (text)
- created_at (timestamp)

Basic usage

1. Install deps:

```powershell
npm install
```

2. Run in development:

```powershell
npm run dev
```

3. Endpoints

- POST /api/auth/register { email, password }
- POST /api/auth/login { email, password }
- GET /api/auth/me Bearer <token>

Notes

- Keep `SUPABASE_KEY` secret. For production use server-side service-role key or use Supabase Auth.
- This example stores hashed passwords in Supabase. If you prefer Auth features, use Supabase Auth directly.

# Backend Cazza - Production Level Express API

A scalable, production-ready backend API built with Express.js, Supabase, and custom JWT authentication.

## Features

- 🔐 Custom JWT Authentication (no Supabase Auth)
- 🗄️ Supabase Database Integration
- 🛡️ Security Middleware (Helmet, CORS, Rate Limiting)
- 📝 Input Validation & Error Handling
- 🏗️ MVC Architecture
- 🚀 Production Ready

## Tech Stack

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **Supabase** - Database
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Helmet** - Security headers
- **CORS** - Cross-origin resource sharing
- **express-rate-limit** - Rate limiting
- **express-validator** - Input validation

## Project Structure

```
backend-cazza/
├── config/
│   ├── database.js      # Supabase connection
│   ├── environment.js   # Environment config
│   └── jwt.js          # JWT configuration
├── controllers/
│   └── authController.js # Authentication logic
├── middleware/
│   ├── auth.js         # JWT authentication
│   ├── errorHandler.js # Global error handling
│   ├── rateLimiter.js  # Rate limiting
│   └── validation.js   # Input validation
├── models/
│   └── User.js         # User model
├── routes/
│   ├── auth.js          # Auth routes
│   └── index.js      # Main routes
├── database/
│   └── schema.sql    # Database schema
├── server.js         # Main server file
└── package.json      # Dependencies
```

## Setup Instructions

### 1. Environment Variables

Create a `.env` file in the root directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d

# Supabase Configuration
SUPABASE_URL=your-supabase-project-url
SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### 2. Database Setup

1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Run the SQL from `database/schema.sql`
4. This will create the `users` table with proper indexes and triggers

### 3. Install Dependencies

```bash
npm install
```

### 4. Start the Server

```bash
# Development
npm run dev

# Production
npm start
```

## API Endpoints

### Authentication

| Method | Endpoint                    | Description        | Access  |
| ------ | --------------------------- | ------------------ | ------- |
| POST   | `/api/auth/signup`          | Register new user  | Public  |
| POST   | `/api/auth/signin`          | User login         | Public  |
| GET    | `/api/auth/profile`         | Get user profile   | Private |
| PUT    | `/api/auth/profile`         | Update profile     | Private |
| POST   | `/api/auth/change-password` | Change password    | Private |
| POST   | `/api/auth/deactivate`      | Deactivate account | Private |
| GET    | `/api/auth/verify`          | Verify token       | Private |

### Health Check

| Method | Endpoint      | Description         |
| ------ | ------------- | ------------------- |
| GET    | `/`           | Server health check |
| GET    | `/api/health` | API health check    |

## API Usage Examples

### Signup

```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePass123!",
    "firstName": "John",
    "lastName": "Doe",
    "phone": "+1234567890"
  }'
```

### Signin

```bash
curl -X POST http://localhost:5000/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePass123!"
  }'
```

### Get Profile (with JWT token)

```bash
curl -X GET http://localhost:5000/api/auth/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Security Features

- **JWT Authentication** - Custom token-based auth
- **Password Hashing** - bcryptjs with salt rounds
- **Rate Limiting** - Prevents brute force attacks
- **Input Validation** - Comprehensive request validation
- **CORS Protection** - Configurable cross-origin policies
- **Security Headers** - Helmet.js protection
- **Error Handling** - Secure error responses

## Production Deployment

1. Set `NODE_ENV=production`
2. Use strong JWT secrets
3. Configure proper CORS origins
4. Set up SSL/TLS
5. Use environment variables for all secrets
6. Monitor logs and performance

## Development

```bash
# Install nodemon for development
npm install -g nodemon

# Run in development mode
npm run dev
```

## License

ISC
