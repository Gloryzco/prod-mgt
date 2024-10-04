# Store API

## Documentation

- **Postman**:

## Project Overview

The Store API is a RESTful API built using Node.js and the NestJS framework. The primary goal of this project is to create and manage products and categories within a store. The API allows users to perform CRUD operations on products and categories, ensuring easy management of inventory and data.

## Methodology

The API was designed with the following key features:

- **Efficient Data Caching**: To improve performance, Redis is used to cache product and category data, reducing the number of requests made to the database and speeding up data retrieval.
- **Rate Limiting**: A rate limiter has been implemented to allow a maximum of 100 requests per second, which helps prevent brute-force attacks and abuse by clients making excessive requests
- **Data Validation and Sanitization**: Input data is validated and sanitized using NestJS validation pipes and mongo-sanitize library, ensuring that only valid and safe data is processed and stored in the database.
- **Data Storage**:MongoDB is used as the database to store product and category data, providing flexibility and scalability for managing store inventory.
- **JWT Authentication**: JSON Web Tokens (JWT) was used for user authentication, allowing secure access to the API endpoints.
- **Unit Testing**: Comprehensive unit tests have been written for both the controllers and service classes to ensure the API functions as expected.
- **Logging**: Winston is utilized as the logging library to capture and manage log data. Winston provides a flexible way to log different levels of messages (info, warn, error) and supports multiple transport layers, making it suitable for production-level applications.

## Setup Guide

### Local Setup

1. **Clone the repository:**

   ```bash
   git clone https://github.com/Gloryzco/prod-mgt.git
   ```

2. **Install dependencies:**

```bash
  npm install
```

3. **Configure environment variables:**
   Create a .env file in the root directory and add the following configuration:

```bash
APP_NAME=
APP_PORT=
APP_DEBUG=

REDIS_HOST=
REDIS_PORT=
MONGODB_URL=

accessTokenSecret =
refreshTokenSecret =
accessTokenExpiration = '15m'
refreshTokenExpiration = '7d'

```

4. **Start the application:**

```bash
npm run start
```

6. **Running Tests:**

```bash
npm run test
```

### Using Docker

Once your `.env` variables is set and you have docker intalled on your local, run the command

```bash
docker-compose up --build
```

## API Endpoints

### Categories

#### Create Category
- **POST** `/categories`
- **Description**: Create a new category.

#### Get All Categories
- **GET** `/categories`
- **Description**: Fetch all categories with optional filters.

#### Get Category By ID
- **GET** `/categories/:id`
- **Description**: Fetch a specific category by ID.
- **Path Params**: `id`

#### Update Category
- **PATCH** `/categories/:id`
- **Description**: Update an existing category.
- **Path Params**: `id`

#### Delete Category
- **DELETE** `/categories/:id`
- **Description**: Delete a specific category by ID.
- **Path Params**: `id`

### Products

#### Create Product
- **POST** `/products`
- **Description**: Create a new product.

#### Get All Products
- **GET** `/products`
- **Description**: Fetch all products with optional filters.

#### Get Product By ID
- **GET** `/products/:id`
- **Description**: Fetch a specific product by ID.
- **Path Params**: `id`

#### Update Product
- **PATCH** `/products/:id`
- **Description**: Update an existing product.
- **Path Params**: `id`

#### Delete Product
- **DELETE** `/products/:id`
- **Description**: Delete a specific product by ID.
- **Path Params**: `id`

### User

#### Register User
- **POST** `/user/register`
- **Description**: Create a new user.
- **Request Body**: `CreateUserDto`

### Authentication

#### User Login
- **POST** `/auth/login`
- **Description**: Authenticate a user and return a JWT.

#### Refresh Token
- **POST** `/auth/refresh-token`
- **Description**: Refresh the access token using the refresh token.