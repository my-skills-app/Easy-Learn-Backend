# Course Management API Documentation

## Authentication

### Register User
- **Endpoint**: POST `/api/auth/register`
- **Description**: Register a new user
- **Request Body**:
  ```json
  {
    "name": "string",
    "email": "string",
    "password": "string"
  }
  ```
- **Response**:
  ```json
  {
    "status": "success",
    "token": "string",
    "user": {
      "id": "string",
      "name": "string",
      "email": "string",
      "role": "string"
    }
  }
  ```

### Login
- **Endpoint**: POST `/api/auth/login`
- **Description**: Authenticate user and get JWT token
- **Request Body**:
  ```json
  {
    "email": "string",
    "password": "string"
  }
  ```
- **Response**:
  ```json
  {
    "status": "success",
    "token": "string",
    "user": {
      "id": "string",
      "name": "string",
      "email": "string",
      "role": "string"
    }
  }
  ```

## Courses

### Get User's Courses
- **Endpoint**: GET `/api/courses/my-courses`
- **Description**: Get all courses the user is enrolled in
- **Headers**:
  ```
  Authorization: Bearer <your-jwt-token>
  ```
- **Response**:
  ```json
  {
    "status": "success",
    "data": [
      {
        "_id": "string",
        "name": "string",
        "description": "string",
        "batchLink": "string"
      }
    ]
  }
  ```

### Get All Courses
- **Endpoint**: GET `/api/courses`
- **Description**: Get all available courses
- **Headers**:
  ```
  Authorization: Bearer <your-jwt-token>
  ```
- **Response**:
  ```json
  {
    "status": "success",
    "data": [
      {
        "_id": "string",
        "name": "string",
        "description": "string",
        "batchLink": "string"
      }
    ]
  }
  ```

### Get Course by ID
- **Endpoint**: GET `/api/courses/:id`
- **Description**: Get course details by ID
- **Headers**:
  ```
  Authorization: Bearer <your-jwt-token>
  ```
- **Response**:
  ```json
  {
    "status": "success",
    "data": {
      "_id": "string",
      "name": "string",
      "description": "string",
      "batchLink": "string"
    }
  }
  ```

### Create Course
- **Endpoint**: POST `/api/courses`
- **Description**: Create a new course
- **Headers**:
  ```
  Authorization: Bearer <your-jwt-token>
  ```
- **Request Body**:
  ```json
  {
    "name": "string",
    "description": "string",
    "batchLink": "string"
  }
  ```
- **Response**:
  ```json
  {
    "status": "success",
    "data": {
      "_id": "string",
      "name": "string",
      "description": "string",
      "batchLink": "string"
    }
  }
  ```

### Update Batch Link
- **Endpoint**: PATCH `/api/courses/:id/batch-link`
- **Description**: Update course batch link
- **Headers**:
  ```
  Authorization: Bearer <your-jwt-token>
  ```
- **Request Body**:
  ```json
  {
    "batchLink": "string"
  }
  ```
- **Response**:
  ```json
  {
    "status": "success",
    "data": {
      "_id": "string",
      "batchLink": "string"
    }
  }
  ```

### Assign Course
- **Endpoint**: POST `/api/courses/:id/assign`
- **Description**: Assign a course to a user
- **Headers**:
  ```
  Authorization: Bearer <your-jwt-token>
  ```
- **Request Body**:
  ```json
  {
    "userId": "string"
  }
  ```
- **Response**:
  ```json
  {
    "status": "success",
    "message": "Course assigned successfully"
  }
  ```
