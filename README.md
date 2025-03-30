# QP Assessment

This project is a backend application built with **Node.js** and **Express.js**. It provides RESTful APIs for managing products and inventory using **Prisma ORM** for database interactions.

## Features

- **Product Management**:

  - Retrieve all products.
  - Add a new product.
  - Update product details.
  - Delete a product.

- **Inventory Management**:
  - Update product stock.

## Prerequisites

Before running the project, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v14 or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- A database supported by Prisma (e.g., PostgreSQL, MySQL, SQLite, etc.)

## Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd qp-assessment
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up the database:

   - Configure your database connection in the `prisma/schema.prisma` file.
   - Run the Prisma migrations to set up the database schema:

     ```bash
     npx prisma migrate dev
     ```

4. Start the development server:

   ```bash
   npm run dev
   ```

## API Endpoints

### Product Management for Admin

- **GET** `/admin/products`  
  Retrieve all products.

- **POST** `/admin/product`  
  Add a new product.  
  **Request Body**:

  ```json
  {
    "name": "Product Name",
    "price": 100,
    "stock": 50
  }
  ```

- **PATCH** `/admin/product/:id`  
  Update product details.  
  **Request Body**:

  ```json
  {
    "name": "Updated Name",
    "price": 120
  }
  ```

- **DELETE** `/admin/product/:id`  
  Delete a product.

### Inventory Management

- **POST** `/admin/inventory`  
  Update product stock.  
  **Request Body**:
  ```json
  {
    "productId": "product-id",
    "stock": 20
  }
  ```

### Product for User

- **GET** `/product/products`  
  Retrieve all available products.

- **POST** `/user/order`
  **Request Body**:

  ```json
  {
    "order": [
      { "productId": "product-id", "quantity": 2 }
      { "productId": "product-id", "quantity": 5 }
    ]
  }
  ```

## Project Structure

```
qp-assessment/
├── src/
│   ├── routes/
│   │   └── admin/
│   │       └── productAction.ts  # API routes for product and inventory management
|   |   └── user/
│   │       └── product.ts
│   │       └── order.ts
│   │   └── auth.ts
│   ├── service/
│   │   └── prisma.ts             # Prisma singleton for database connection
│   └── app.ts                    # Main application entry point
├── prisma/
│   └── schema.prisma             # Prisma schema file
├── package.json
└── README.md
```
