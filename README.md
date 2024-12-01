# E-commerce API
A robust, feature-rich API for building an e-commerce platform using Node.js and Express.

## Technologies Used
- Node.js
- Express
- MongoDB
- JWT (JSON Web Token)
- Mongoose
- Bcrypt (for password hashing)

## Features
- User Authentication: Sign-up, login, and JWT-based authentication.
- Product Management: CRUD operations for products with filters and sorting.
- Order Management: Place and track orders, including status updates.
- Cart System: Add, remove, and manage items in the shopping cart.
- Payment Integration: Simple payment flow (integration with payment services).
- Admin Dashboard: Admin controls to manage users, orders, and products.
- Middleware: Validation, error handling, and authentication checks.

## Installation

1. Clone the repository:
```
git clone https://github.com/SanadAlawi/E-commerce-API.git
```

2. Install dependencies:
```
npm install
```

3. Set up environment variables:

    - `.env` file should include:
        ```
        DB_URI=your_database_uri
        JWT_SECRET=your_jwt_secret
        ```

4. Run the server:
```
npm start
```

## API Endpoints
### Authentication
- **POST /auth/signup** - Create a new user.
- **POST /auth/login** - User login with JWT token.

### Products
- **GET /products** - Get all products (with pagination, sorting, and filtering).
- **POST /products** - Add a new product (Admin only).
- **PUT /products/:id** - Update product details (Admin only).
- **DELETE /products/:id** - Delete a product (Admin only).

### Orders
- **POST /orders** - Create a new order.
- **GET /orders/:userId** - Get orders of a user.
- **PUT /orders/:id** - Update order status (Admin only).

### Cart
- **GET /cart** - Get items in the cart.
- **POST /cart** - Add items to the cart.
- **DELETE /cart/:id** - Remove an item from the cart.