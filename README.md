# 🎓 Learning Platform — Authentication & Authorization System

A secure backend built with **Node.js**, **Express**, **MongoDB**, **JWT**, and **bcrypt**.  
Implements full Role-Based Access Control (RBAC) for **Admin** and **Student** roles.

---

## 📁 Project Structure

```
auth-system/
├── config/
│   └── db.js                  # MongoDB connection
├── controllers/
│   ├── authController.js      # Register, Login, GetMe
│   └── userController.js      # Admin & Student user actions
├── middleware/
│   └── auth.js                # protect() + authorize() middleware
├── models/
│   └── User.js                # Mongoose schema with bcrypt pre-save hook
├── routes/
│   ├── authRoutes.js          # /api/auth/*
│   └── userRoutes.js          # /api/users/*
├── .env.example               # Environment variable template
├── package.json
└── server.js                  # Express app entry point
```

---

## ⚙️ Setup Instructions

### Prerequisites
- Node.js v18+
- MongoDB (local or [MongoDB Atlas](https://www.mongodb.com/atlas))

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd auth-system
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment variables
```bash
cp .env.example .env
```
Edit `.env` with your values:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/learning_platform
JWT_SECRET=your_super_secret_key_here
JWT_EXPIRE=7d
```

### 4. Start the server
```bash
# Development (with auto-reload)
npm run dev

# Production
npm start
```

Server runs at: `http://localhost:5000`

---

## 🔑 Authentication Flow

```
Client → POST /api/auth/register → receives JWT token
Client → POST /api/auth/login    → receives JWT token
Client → sends token in header:  Authorization: Bearer <token>
Server → middleware verifies token → grants or denies access
```

---

## 📡 API Endpoints

### Auth Routes — `/api/auth`

| Method | Endpoint             | Access  | Description              |
|--------|----------------------|---------|--------------------------|
| POST   | `/api/auth/register` | Public  | Register a new user      |
| POST   | `/api/auth/login`    | Public  | Login and receive token  |
| GET    | `/api/auth/me`       | Private | Get current user info    |

---

### User Routes — `/api/users`

| Method | Endpoint                  | Access        | Description              |
|--------|---------------------------|---------------|--------------------------|
| GET    | `/api/users`              | Admin only    | Get all users            |
| GET    | `/api/users/:id`          | Admin only    | Get a user by ID         |
| DELETE | `/api/users/:id`          | Admin only    | Delete a user            |
| GET    | `/api/users/profile/me`   | Student/Admin | View own profile         |
| PUT    | `/api/users/profile/me`   | Student/Admin | Update own profile       |

---

## 📋 Sample Requests & Responses

### Register a new student

**Request**
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "Alice Johnson",
  "email": "alice@example.com",
  "password": "securePass123"
}
```

**Response** `201 Created`
```json
{
  "success": true,
  "message": "Registration successful.",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "64f1a2b3c4d5e6f7a8b9c0d1",
    "name": "Alice Johnson",
    "email": "alice@example.com",
    "role": "student"
  }
}
```

---

### Login

**Request**
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "alice@example.com",
  "password": "securePass123"
}
```

**Response** `200 OK`
```json
{
  "success": true,
  "message": "Login successful.",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "64f1a2b3c4d5e6f7a8b9c0d1",
    "name": "Alice Johnson",
    "email": "alice@example.com",
    "role": "student"
  }
}
```

---

### Get own profile (Student)

**Request**
```http
GET /api/users/profile/me
Authorization: Bearer <token>
```

**Response** `200 OK`
```json
{
  "success": true,
  "user": {
    "_id": "64f1a2b3c4d5e6f7a8b9c0d1",
    "name": "Alice Johnson",
    "email": "alice@example.com",
    "role": "student",
    "bio": "",
    "enrolledCourses": [],
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

---

### Update own profile (Student)

**Request**
```http
PUT /api/users/profile/me
Authorization: Bearer <token>
Content-Type: application/json

{
  "bio": "Computer Science student passionate about web development.",
  "enrolledCourses": ["Node.js Fundamentals", "MongoDB Essentials"]
}
```

**Response** `200 OK`
```json
{
  "success": true,
  "message": "Profile updated successfully.",
  "user": {
    "_id": "64f1a2b3c4d5e6f7a8b9c0d1",
    "name": "Alice Johnson",
    "email": "alice@example.com",
    "role": "student",
    "bio": "Computer Science student passionate about web development.",
    "enrolledCourses": ["Node.js Fundamentals", "MongoDB Essentials"]
  }
}
```

---

### Get all users (Admin only)

**Request**
```http
GET /api/users
Authorization: Bearer <admin_token>
```

**Response** `200 OK`
```json
{
  "success": true,
  "count": 2,
  "users": [
    {
      "_id": "64f1a2b3c4d5e6f7a8b9c0d1",
      "name": "Alice Johnson",
      "email": "alice@example.com",
      "role": "student",
      "createdAt": "2024-01-15T10:30:00.000Z"
    },
    {
      "_id": "64f1a2b3c4d5e6f7a8b9c0d2",
      "name": "Bob Smith",
      "email": "bob@example.com",
      "role": "student",
      "createdAt": "2024-01-16T08:00:00.000Z"
    }
  ]
}
```

---

### Delete a user (Admin only)

**Request**
```http
DELETE /api/users/64f1a2b3c4d5e6f7a8b9c0d1
Authorization: Bearer <admin_token>
```

**Response** `200 OK`
```json
{
  "success": true,
  "message": "User 'Alice Johnson' has been deleted successfully."
}
```

---

## ❌ Error Responses

| Scenario                        | Status | Message                                          |
|---------------------------------|--------|--------------------------------------------------|
| Missing/invalid token           | 401    | "Access denied. No token provided."              |
| Expired token                   | 401    | "Invalid or expired token."                      |
| Insufficient role               | 403    | "Access forbidden. Role 'student' is not authorized." |
| Duplicate email                 | 400    | "An account with this email already exists."     |
| Wrong credentials               | 401    | "Invalid email or password."                     |
| Resource not found              | 404    | "User not found."                                |

---

## 🔒 Security Design

| Feature           | Implementation                                         |
|-------------------|--------------------------------------------------------|
| Password hashing  | `bcryptjs` with salt rounds = 12                      |
| Token signing     | JWT with secret key + expiry                          |
| Password hiding   | `select: false` on password field in Mongoose schema  |
| Role enforcement  | `authorize()` middleware checks `req.user.role`       |
| Input validation  | Mongoose schema validators + manual checks            |
| Admin protection  | Public registration always assigns `student` role     |

---

## 🛠️ Creating an Admin (Manual)

Since admin accounts cannot be registered publicly, create one via MongoDB shell or Compass:

```js
// After starting the server, register a normal user, then promote via MongoDB:
db.users.updateOne(
  { email: "admin@example.com" },
  { $set: { role: "admin" } }
)
```

Or seed one in a script — just make sure to hash the password first using bcrypt.
