# Course Management System Backend

A robust Node.js backend application built with Express.js and MongoDB, designed for managing educational courses and user interactions.

## Features

- ✅ User Authentication & Authorization
- ✅ Course Management System
- ✅ Role-based Access Control (Admin/User)
- ✅ Secure MongoDB Connection with Retry Logic
- ✅ Comprehensive Error Handling
- ✅ Security Middleware
- ✅ File Upload Support
- ✅ Course Batch Management
- ✅ Course Thumbnail Support
- ✅ Health Check Endpoint
- ✅ Graceful Shutdown Handling

## API Endpoints

### Authentication
- POST `/api/auth/register` - Register new user
- POST `/api/auth/login` - User login

### Courses (User)
- GET `/api/courses` - Get all available courses
- GET `/api/courses/:id` - Get course details
- GET `/api/courses/my-courses` - Get user's enrolled courses
- GET `/api/courses/:id/batches` - Get course batches (if enrolled)

### Courses (Admin)
- POST `/api/courses` - Create new course
- POST `/api/courses/assign` - Assign course to user
- PUT `/api/courses/:id` - Update course details
- DELETE `/api/courses/:id` - Delete course

## Security Features

- JWT Authentication
- Role-based Authorization (Admin/User roles)
- Password Hashing (bcrypt)
- Input Validation
- Security Headers (Helmet)
- Compression
- CORS Configuration
- Rate Limiting

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- MongoDB Atlas (Recommended for production)
- JWT Secret Key

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file:
   ```
   PORT=4000
   NODE_ENV=development
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_secret_key
   ```

## Running the Application

- Development mode:
  ```bash
  npm run dev
  ```

- Production mode:
  ```bash
  npm start
  ```

## API Documentation

### Authentication

#### Register
- **POST `/api/auth/register`**
- **Body**:
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }
  ```

#### Login
- **POST `/api/auth/login`**
- **Body**:
  ```json
  {
    "email": "john@example.com",
    "password": "password123"
  }
  ```

### Courses (User)

#### Get All Courses
- **GET `/api/courses`**
- **Headers**:
  ```
  Authorization: Bearer <token>
  ```

#### Get Course Details
- **GET `/api/courses/:id`**
- **Headers**:
  ```
  Authorization: Bearer <token>
  ```

#### Get User's Enrolled Courses
- **GET `/api/courses/my-courses`**
- **Headers**:
  ```
  Authorization: Bearer <token>
  ```

### Courses (Admin)

#### Create Course
- **POST `/api/courses`**
- **Headers**:
  ```
  Authorization: Bearer <token>
  ```
- **Body**:
  ```json
  {
    "title": "Full Stack Development",
    "description": "Learn full stack development",
    "instructor": "John Doe",
    "duration": "12 weeks",
    "price": 199.99,
    "thumbnail": "https://example.com/thumbnail.jpg",  // Optional
    "batchLink": "https://example.com/batch"           // Optional, defaults to 'nobatch'
  }
  ```

#### Update Course
- **PUT `/api/courses/:id`**
- **Headers**:
  ```
  Authorization: Bearer <token>
  ```
- **Body**:
  ```json
  {
    "title": "Updated Course Title",
    "description": "Updated description",
    "thumbnail": "https://example.com/new-thumbnail.jpg",  // Optional
    "batchLink": "https://example.com/new-batch"          // Optional
  }
  ```

#### Delete Course
- **DELETE `/api/courses/:id`**
- **Headers**:
  ```
  Authorization: Bearer <token>
  ```

#### Assign Course to User
- **POST `/api/courses/assign`**
- **Headers**:
  ```
  Authorization: Bearer <token>
  ```
- **Body**:
  ```json
  {
    "courseId": "course123",
    "userId": "user123"
  }
  ```

## Security

- All endpoints require authentication except register and login
- Admin endpoints require admin role
- Passwords are hashed using bcrypt
- JWT tokens are used for authentication
- API responses are compressed
- Security headers are enabled
- Rate limiting is implemented
- Input validation is enforced

## Environment Variables

- `PORT` - Server port (default: 4000)
- `NODE_ENV` - Environment (development/production)
- `MONGO_URI` - MongoDB connection string
- `JWT_SECRET` - JWT secret key
- `RATE_LIMIT_WINDOW` - Rate limiting window in milliseconds
- `RATE_LIMIT_MAX` - Maximum requests in rate limiting window

## Error Handling

All API responses follow this format:
```json
{
  "status": "success/error",
  "message": "Description of success/error",
  "data": {} // Only present in success responses
}
```
