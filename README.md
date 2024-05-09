# Authentication API

This project is a Node.js-based authentication API that allows users to register, log in, view and update their profiles, and set their profile visibility to public or private. The API also includes role-based access control, allowing admin users to view all profiles, while normal users can only see public profiles.

## Table of Contents

1. [Features](#features)
2. [Installation](#installation)
3. [Usage](#usage)
4. [Endpoints](#endpoints)
5. [Authorization and Authentication](#authorization-and-authentication)
6. [Environment Variables](#environment-variables)

## Features

- **User Registration**: Users can create new accounts.
- **User Login**: Users can log in with email and password.
- **Profile View**: Users can view their own profiles.
- **Profile Update**: Users can update their profile details, including photo, name, bio, phone, and more.
- **Profile Visibility**: Users can set their profile visibility to public or private.
- **Public Profiles**: Anyone can view public profiles.
- **Admin Access**: Admin users can view both public and private profiles.
- **Role-Based Access Control**: Implemented for security and data protection.

## Installation

To set up this project on your local environment, follow these steps:

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd <repository-name>

## Usage

After starting the server, you can interact with the API using a tool like Postman or curl. Ensure you have a valid JWT token (obtained from the login endpoint) to access authenticated endpoints.

## Endpoints

### Register
- **Method**: `POST`
- **Path**: `/register`
- **Description**: Registers a new user with email, password, and name.
- **Request Body**: 
  - `email`: User's email address.
  - `password`: User's password (should be hashed in the backend).
  - `name`: User's name.
- **Response**: 
  - On success: 201 status code with the newly created user details.
  - On error: Appropriate error message (e.g., 400 for invalid data).

### Login
- **Method**: `POST`
- **Path**: `/auth/login`
- **Description**: Logs in a user with email and password, returning a JWT token.
- **Request Body**: 
  - `email`: User's email address.
  - `password`: User's password.
- **Response**:
  - On success: 200 status code with a JWT token.
  - On error: Appropriate error message (e.g., 400 for invalid credentials).

### Profile
- **Method**: `GET`
- **Path**: `/profiles/profile`
- **Description**: View the current user's profile.
- **Authorization**: Requires JWT token.
- **Response**:
  - On success: 200 status code with user profile details.
  - On error: Appropriate error message (e.g., 401 for unauthorized).

### Update Profile
- **Method**: `PUT`
- **Path**: `/profiles/profile`
- **Description**: Update the current user's profile (photo, name, bio, phone, profile visibility).
- **Authorization**: Requires JWT token.
- **Request Body**:
  - `photo`: User's profile photo (URL or file upload).
  - `name`: User's name.
  - `bio`: User's bio.
  - `phone`: User's phone number.
  - `profile_visibility`: "public" or "private".
- **Response**:
  - On success: 200 status code with updated profile details.
  - On error: Appropriate error message (e.g., 400 for invalid data).

### Public Profiles (User Can See)
- **Method**: `GET`
- **Path**: `/profiles/public-profiles`
- **Description**: Retrieve all public profiles.
- **Response**:
  - On success: 200 status code with a list of public profiles.
  - On error: 500 for server error.

### All Profiles (Admin Only)
- **Method**: `GET`
- **Path**: `/profiles/user-profile`
- **Description**: Admin-only endpoint to retrieve all profiles (both public and private).
- **Authorization**: Requires JWT token and admin role.
- **Response**:
  - On success: 200 status code with a list of all profiles.
  - On error: Appropriate error message (e.g., 403 for forbidden).

## Authorization and Authentication

This API uses JSON Web Tokens (JWT) for authentication. When making requests to authenticated endpoints, include the JWT token in the `Authorization` header using the format `Bearer <your-token>`. Admin users have additional access rights, allowing them to view both public and private profiles.

## Environment Variables

Ensure you have a `.env` file with the necessary environment variables. At a minimum, set the following:

- `JWT_SECRET`: A secret key for JWT token signing.
- `DB_USER`: The database user.
- `DB_PASSWORD`: The database password.
- `DB_HOST`: The database host.
- `DB_PORT`: The database port.
- `DB_NAME`: The name of the database.

