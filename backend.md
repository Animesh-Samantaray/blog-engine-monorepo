# Backend Documentation

## Overview

This project contains a Node.js + Express backend for a blog management system. It uses MongoDB with Mongoose for persistence, JWT-based cookie authentication, Multer for image uploads, and role-based access control for admin features.

The backend exposes a REST API for:

- user registration, login, and logout
- blog creation, editing, deletion, search, and category filtering
- comments on blog posts
- profile management and personal dashboard data
- admin statistics and moderation actions

## Tech Stack

- Node.js
- Express
- MongoDB + Mongoose
- JWT for authentication
- bcrypt for password hashing
- cookie-parser for token cookies
- cors for frontend access control
- multer for image uploads
- morgan is listed as a dependency, but is not currently wired into `server.js`

## Folder Structure

```text
server/
  .env
  .gitignore
  package.json
  server.js
  configs/
    db.js
  controllers/
    admin.controller.js
    auth.controller.js
    blog.controller.js
    comment.controller.js
    profile.controller.js
  middlewares/
    adminMiddleware.js
    authMiddleware.js
    uploadMiddleware.js
  models/
    Blog.model.js
    Comment.model.js
    User.model.js
  routes/
    admin.route.js
    auth.route.js
    blog.route.js
    comment.route.js
    profile.route.js
  uploads/
  utils/
    createToken.js
    deleteImage.js
```

## Application Flow

`server.js` is the main entry point. It:

1. loads environment variables with `dotenv`
2. connects to MongoDB through `configs/db.js`
3. enables CORS for `http://localhost:5173` with credentials enabled
4. parses JSON and cookies
5. serves uploaded files from `/uploads`
6. mounts route groups under `/api/*`
7. exposes a basic health check at `/`

## Environment Variables

The code expects these environment variables:

- `MONGO_URI` - MongoDB connection string
- `JWT_SECRET` - secret used to sign and verify JWT tokens
- `ADMIN_ACCESS_TOKEN` - shared token used during registration to create an admin account
- `PORT` - optional server port, defaults to `5000`

## Authentication Model

Authentication is cookie-based.

- On register and login, the backend creates a JWT with `utils/createToken.js`
- The token is stored in an `httpOnly` cookie named `token`
- `middlewares/authMiddleware.js` reads the cookie, verifies the JWT, loads the current user, and attaches the user object to `req.user`
- `middlewares/adminMiddleware.js` blocks non-admin users from admin routes

Admin registration is supported during normal signup if the request body includes `adminAccessToken` that matches `process.env.ADMIN_ACCESS_TOKEN`.

## File Uploads

`middlewares/uploadMiddleware.js` uses Multer with disk storage.

- uploaded files are written to the `uploads/` directory
- filenames are made unique using a timestamp and random suffix
- allowed image types: `jpg`, `jpeg`, `png`, `webp`
- maximum file size: 5 MB

Uploaded images are exposed publicly through `/uploads` in `server.js`.

## Data Models

### User

Fields:

- `name` - required string
- `email` - required, unique, lowercase string
- `password` - required hashed password
- `profileImage` - string URL/path, defaults to a generic avatar
- `bio` - optional text
- `role` - `user` or `admin`, defaults to `user`

### Blog

Fields:

- `title` - required string
- `content` - required body text
- `image` - optional blog image path
- `category` - one of `Technology`, `Sports`, `Art`, `Education`, `Travel`, `Food`, `Lifestyle`, `Other`
- `author` - required reference to `User`
- `isPublished` - boolean, defaults to `true`

### Comment

Fields:

- `comment` - required string
- `user` - required reference to `User`
- `blog` - required reference to `Blog`

## Controllers

### auth.controller.js

- `registerUser` - validates input, checks for duplicate email, hashes the password, creates the user, and sets the auth cookie
- `loginUser` - validates credentials, compares passwords, and sets the auth cookie
- `logoutUser` - clears the auth cookie

### blog.controller.js

- `createBlog` - creates a blog for the authenticated user and stores an uploaded image if provided
- `getAllBlogs` - returns all blogs sorted by newest first and populates author info
- `getBlogById` - returns a single blog by id with populated author details
- `updateBlog` - allows the author or an admin to edit blog content, category, publish state, and image
- `deleteBlog` - allows the author or an admin to delete a blog
- `searchBlogs` - case-insensitive title search using the `search` query parameter
- `getBlogsByCategory` - filters blogs by category route parameter

### comment.controller.js

- `addComment` - adds a comment to an existing blog for the authenticated user
- `getCommentsByBlog` - returns all comments for a blog sorted newest first
- `updateComment` - allows the comment author or an admin to update a comment
- `deleteComment` - allows the comment author or an admin to delete a comment

### profile.controller.js

- `getMyProfile` - returns the current user profile without the password
- `updateProfile` - updates name, bio, and profile image
- `getMyBlogs` - returns blogs authored by the current user
- `getDashboard` - returns profile data plus counts for the user's blogs and comments

### admin.controller.js

- `getDashboardStats` - returns total users, blogs, and comments plus recent users and blogs
- `getAllUsers` - lists all users without passwords
- `deleteUser` - removes a user and also deletes that user's blogs and comments
- `getAllBlogs` - lists all blogs for moderation
- `deleteBlog` - deletes a blog and its related comments

## Routes

### Auth Routes - `/api/auth`

- `POST /register`
- `POST /login`
- `POST /logout`

### Blog Routes - `/api/blog`

Public:

- `GET /` - all blogs
- `GET /search?search=term` - search blogs by title
- `GET /category/:category` - blogs by category
- `GET /:id` - single blog by id

Protected:

- `POST /` - create blog with optional image upload
- `PUT /:id` - update blog with optional image upload
- `DELETE /:id` - delete blog

### Comment Routes - `/api/comment`

Public:

- `GET /:blogId` - comments for a blog

Protected:

- `POST /:blogId` - add comment
- `PUT /:id` - update comment
- `DELETE /:id` - delete comment

### Profile Routes - `/api/profile`

All routes require authentication:

- `GET /` - current user profile
- `PUT /` - update profile with optional profile image upload
- `GET /blogs` - current user's blogs
- `GET /dashboard` - personal dashboard data

### Admin Routes - `/api/admin`

All routes require authentication and admin access:

- `GET /dashboard` - admin statistics
- `GET /users` - list users
- `DELETE /users/:id` - delete a user and their related content
- `GET /blogs` - list all blogs
- `DELETE /blogs/:id` - delete any blog and its comments

## Notes

- Passwords are hashed with bcrypt before storage.
- JWT tokens expire after 7 days.
- `logoutUser` depends on the auth cookie being present.
- `utils/deleteImage.js` exists but is currently empty and not used by the controllers.
- The backend currently allows front-end access only from `http://localhost:5173`.

## Health Check

The root route returns a simple status response:

- `GET /` -> `{ success: true, message: "Blog Management API is running" }`

## Run Commands

From the `server/` directory:

```bash
npm install
npm run dev
```

Or production start:

```bash
npm start
```