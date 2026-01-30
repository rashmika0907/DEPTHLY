# Depthly Backend

Node.js + Express + MongoDB authentication backend for Depthly.

## Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or remote instance)

## Installation

```bash
cd backend
npm install
```

## Configuration

Create a `.env` file in the backend directory with the following variables:

```env
# MongoDB connection string
MONGODB_URI=mongodb://localhost:27017/depthly

# JWT configuration
JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRE=7d

# Server port
PORT=5000
```

## Running the Server

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

The server will be available at `http://localhost:5000`

## API Endpoints

### POST /api/auth/signup
Create a new user account.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

### POST /api/auth/login
Authenticate a user.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

## MongoDB Setup

### Local MongoDB

1. Install MongoDB Community Edition from [mongodb.com](https://www.mongodb.com/try/download/community)
2. Start MongoDB service
3. Use default connection string: `mongodb://localhost:27017/depthly`

### MongoDB Atlas (Cloud)

1. Create a free account at [mongodb.com/atlas](https://www.mongodb.com/cloud/atlas)
2. Create a cluster and database
3. Get your connection string
4. Update `MONGODB_URI` in `.env` file

## Features

- User registration with email validation
- User login with password verification
- JWT token-based authentication
- Password hashing with bcryptjs
- Automatic session persistence
- CORS enabled for frontend integration
- Error handling and validation

## Security Notes

- Passwords are hashed using bcryptjs (10 salt rounds)
- JWTs expire after 7 days by default
- Change `JWT_SECRET` in production
- Use HTTPS in production
- Add rate limiting for production
- Implement additional validation as needed

## Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running
- Check `MONGODB_URI` is correct
- Verify network connection if using MongoDB Atlas

### CORS Errors
- Frontend and backend must match `http://localhost:5173` and `http://localhost:5000`
- CORS is enabled for all origins in development

### JWT Issues
- Ensure token is sent in `Authorization: Bearer <token>` header
- Check token hasn't expired
- Verify `JWT_SECRET` matches on both creation and verification
