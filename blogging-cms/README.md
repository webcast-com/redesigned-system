# Blogging CMS

A full-stack blogging content management system built with Node.js, Express, MongoDB, and React.

## Features

- User authentication (register/login)
- Admin dashboard for managing posts
- Create, edit, delete blog posts
- Public blog view
- Post categories and tags
- Publish/unpublish posts

## Setup

### Backend

1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the backend directory with the following variables:
   ```
   MONGO_URI=your_mongodb_connection_string_here
   JWT_SECRET=your_jwt_secret_here
   PORT=5000
   ```

4. Start the backend server:
   ```
   npm run dev
   ```

### Frontend

1. Navigate to the frontend directory:
   ```
   cd frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the React app:
   ```
   npm start
   ```

The app will run on `http://localhost:3000` and proxy API requests to `http://localhost:5000`.

## Usage

- Visit the home page to view published posts.
- Go to `/admin/login` to log in as an admin.
- After logging in, access the admin dashboard to manage posts.

## API Endpoints

### Auth
- POST /api/auth/register - Register a new user
- POST /api/auth/login - Login user
- GET /api/auth/profile - Get user profile (protected)

### Posts
- GET /api/posts - Get all published posts
- GET /api/posts/:id - Get single post
- POST /api/posts - Create a new post (admin only)
- PUT /api/posts/:id - Update a post (admin only)
- DELETE /api/posts/:id - Delete a post (admin only)
- GET /api/posts/admin/all - Get all posts (admin only)

## Technologies Used

- Backend: Node.js, Express, MongoDB, Mongoose, JWT, bcryptjs
- Frontend: React, React Router, Axios
