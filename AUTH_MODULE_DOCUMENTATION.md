# Auth Module Documentation

## Overview
This document describes the completed authentication module that handles user registration, login, email, username, and password management.

## Project Structure

```
src/modules/auth/
├── auth.contrller.ts          # API endpoints
├── auth.services.ts            # Business logic
├── auth.modules.ts             # Module configuration
├── dto/
│   ├── register.dto.ts        # Registration request validation
│   └── login.dto.ts           # Login request validation
└── entities/
    └── user.entity.ts         # User database model
```

## Features Implemented

### 1. User Entity (`user.entity.ts`)
- **id**: UUID primary key (auto-generated)
- **email**: Unique email address
- **username**: Unique username
- **password**: Hashed password (bcrypt)
- **createdAt**: Automatic creation timestamp
- **updatedAt**: Automatic update timestamp

### 2. DTOs (Data Transfer Objects)

#### RegisterDto (`register.dto.ts`)
Validates registration requests with:
- `email`: Valid email format required
- `username`: String, minimum 3 characters
- `password`: String, minimum 6 characters

#### LoginDto (`login.dto.ts`)
Validates login requests with:
- `username`: String required
- `password`: String, minimum 6 characters

### 3. Auth Service (`auth.services.ts`)

#### Methods:

**register(registerDto: RegisterDto)**
- Validates email and username are unique
- Hashes password using bcrypt (salt rounds: 10)
- Creates new user in database
- Returns user without password
- Throws `ConflictException` if email/username exists

**login(loginDto: LoginDto)**
- Finds user by username
- Compares provided password with stored hash
- Returns user without password on success
- Throws `UnauthorizedException` on invalid credentials

**findUserById(id: string)**
- Retrieves user by UUID
- Returns user object or null

**findUserByUsername(username: string)**
- Retrieves user by username
- Returns user object or null

**findUserByEmail(email: string)**
- Retrieves user by email
- Returns user object or null

### 4. Auth Controller (`auth.contrller.ts`)

#### Endpoints:

**POST /auth/register**
- Status: 201 Created
- Request body: RegisterDto
- Response: `{ user: User, message: string }`
- Registers new user and returns user details

**POST /auth/login**
- Status: 200 OK
- Request body: LoginDto
- Response: `{ user: User, message: string }`
- Authenticates user and returns user details

## API Usage Examples

### Registration
```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "username": "johndoe",
    "password": "securepassword123"
  }'
```

Response (201 Created):
```json
{
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "user@example.com",
    "username": "johndoe",
    "createdAt": "2025-11-19T10:30:00.000Z",
    "updatedAt": "2025-11-19T10:30:00.000Z"
  },
  "message": "User registered successfully"
}
```

### Login
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "johndoe",
    "password": "securepassword123"
  }'
```

Response (200 OK):
```json
{
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "user@example.com",
    "username": "johndoe",
    "createdAt": "2025-11-19T10:30:00.000Z",
    "updatedAt": "2025-11-19T10:30:00.000Z"
  },
  "message": "Login successful"
}
```

## Security Features

1. **Password Hashing**: Uses bcrypt with 10 salt rounds
2. **Password Never Returned**: API responses exclude password field
3. **Unique Constraints**: Email and username must be unique
4. **Input Validation**: All inputs validated using class-validator
5. **Error Handling**: 
   - ConflictException for duplicate users
   - UnauthorizedException for invalid credentials

## Database Integration

The auth module integrates with TypeORM:
- Uses PostgreSQL database (configured in `app.module.ts`)
- Automatic schema synchronization
- Entity relationships ready for future extensions

## Dependencies Added

- **bcrypt**: ^8.x - Password hashing
- **@types/bcrypt**: TypeScript types for bcrypt
- **class-validator**: ^0.x - DTO validation
- **class-transformer**: ^0.x - DTO transformation
- **@nestjs/typeorm**: ^11.0.0 - ORM integration (already installed)

## Module Integration

The AuthModule is properly registered in `app.module.ts`:
```typescript
imports: [
  // ... other imports
  AuthModule,
]
```

## Configuration

The auth module requires the following environment variables (in `.env`):
```
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=password
DATABASE_NAME=demo_test
```

## Future Enhancements

Potential features to add:
- JWT token generation and validation
- Refresh tokens
- Email verification
- Password reset functionality
- Two-factor authentication
- OAuth integration
- Role-based access control (RBAC)
- User profile endpoints
- Password change endpoint

## Testing

To test the auth endpoints, ensure:
1. PostgreSQL is running
2. Environment variables are configured
3. Application is running (`npm run start:dev`)
4. Database is synchronized

Then use the curl examples above or Postman/Insomnia to test the endpoints.
