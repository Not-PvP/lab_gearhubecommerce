# E-Commerce & Logistics Backend REST API

A RESTful backend API developed using **Node.js, TypeScript, Express, and PostgreSQL**. This project implements CRUD operations for customers, products, orders, order items, vendors, and supplies using raw SQL queries through the `pg` library.

## Technologies Used

* Node.js
* TypeScript
* Express.js
* PostgreSQL
* node-postgres (`pg`)
* dotenv

## Project Structure

```text
src/
├── db.ts
├── server.ts
└── routes/
    ├── customers.ts
    ├── products.ts
    ├── orders.ts
    ├── orderItems.ts
    ├── vendors.ts
    └── supplies.ts
```

## Prerequisites

Before running the project, make sure the following are installed:

* [Node.js](https://nodejs.org/)
* [PostgreSQL](https://www.postgresql.org/)

## Installation

Clone the repository:

```bash
git clone https://github.com/Not-PvP/lab_backendrestapi.git
cd <project-folder>
```

Install the project dependencies:

```bash
npm install
```

## Database Setup

Create a PostgreSQL database and run the provided database setup SQL script.

The database contains the following tables:

* `customer`
* `orders`
* `product`
* `order_item`
* `vendor`
* `supplies`

Make sure PostgreSQL is running before starting the API.

## Environment Variables

Create a `.env` file in the root directory:

```env
PORT=3000

DB_USER=postgres
DB_HOST=localhost
DB_NAME=ecommerce_logistics
DB_PASSWORD=your_password
DB_PORT=5432
```

Replace the values with the PostgreSQL configuration for the local environment.

The `.env` file should not be committed to the repository.

## Running the Project

Start the development server using:

```bash
npm run dev
```

The API will be available at:

```text
http://localhost:3000
```

All API endpoints use the following base path:

```text
http://localhost:3000/api/v1
```

## API Endpoints

### Customers

| Method | Endpoint                | Description          |
| ------ | ----------------------- | -------------------- |
| GET    | `/api/v1/customers`     | Get all customers    |
| GET    | `/api/v1/customers/:id` | Get a customer by ID |
| POST   | `/api/v1/customers`     | Create a customer    |
| PUT    | `/api/v1/customers/:id` | Update a customer    |
| DELETE | `/api/v1/customers/:id` | Delete a customer    |

### Products

| Method | Endpoint                                | Description                 |
| ------ | --------------------------------------- | --------------------------- |
| GET    | `/api/v1/products`                      | Get all products            |
| GET    | `/api/v1/products?category=Electronics` | Filter products by category |
| GET    | `/api/v1/products/:id`                  | Get a product by ID         |
| POST   | `/api/v1/products`                      | Create a product            |
| PATCH  | `/api/v1/products/:id/price`            | Update a product's price    |

### Orders

| Method | Endpoint                              | Description                        |
| ------ | ------------------------------------- | ---------------------------------- |
| GET    | `/api/v1/orders`                      | Get all orders                     |
| GET    | `/api/v1/orders/customer/:customerId` | Get orders belonging to a customer |
| POST   | `/api/v1/orders`                      | Create an order                    |
| DELETE | `/api/v1/orders/:id`                  | Delete an order                    |

### Order Items

| Method | Endpoint                       | Description                     |
| ------ | ------------------------------ | ------------------------------- |
| GET    | `/api/v1/order-items/:orderId` | Get items belonging to an order |
| POST   | `/api/v1/order-items`          | Add an item to an order         |

### Vendors

| Method | Endpoint          | Description     |
| ------ | ----------------- | --------------- |
| GET    | `/api/v1/vendors` | Get all vendors |

### Supplies

| Method | Endpoint                                | Description                        |
| ------ | --------------------------------------- | ---------------------------------- |
| GET    | `/api/v1/supplies/vendor/:vendorId`     | Get supplies belonging to a vendor |
| PUT    | `/api/v1/supplies/:vendorId/:productId` | Update supply stock quantity       |

## API Examples

### Get All Customers

```http
GET /api/v1/customers
```

### Get a Customer

```http
GET /api/v1/customers/C101
```

### Create a Customer

```http
POST /api/v1/customers
Content-Type: application/json
```

```json
{
  "customer_id": "C106",
  "customer_name": "Frank Miller",
  "city": "Austin",
  "membership_level": "Silver"
}
```

### Update a Customer

```http
PUT /api/v1/customers/C106
Content-Type: application/json
```

```json
{
  "city": "Seattle",
  "membership_level": "Gold"
}
```

### Create a Product

```http
POST /api/v1/products
Content-Type: application/json
```

```json
{
  "product_id": "P006",
  "product_name": "Mechanical Keyboard",
  "category": "Electronics",
  "unit_price": 120.00
}
```

### Update Product Price

```http
PATCH /api/v1/products/P006/price
Content-Type: application/json
```

```json
{
  "unit_price": 99.99
}
```

## Database Queries

The API uses raw SQL queries through the PostgreSQL `pg` library.

All queries use **parameterized values** to help prevent SQL injection.

Example:

```typescript
const result = await pool.query(
  "SELECT * FROM customer WHERE customer_id = $1",
  [req.params.id]
);
```

No ORM or query builder is used.

The project also avoids multi-table `JOIN` queries as required by the activity specifications.

## Error Handling

The API uses `try/catch` blocks to handle database and request errors.

Common responses include:

* `200 OK` — Request completed successfully
* `201 Created` — Resource was successfully created
* `204 No Content` — Resource was successfully deleted without a response body
* `400 Bad Request` — Invalid request or database constraint violation
* `404 Not Found` — Requested resource does not exist
* `500 Internal Server Error` — Unexpected server or database error

## Testing

The API can be tested using tools such as:

* Postman
* Thunder Client
* Insomnia
* `curl`

Example:

```bash
curl http://localhost:3000/api/v1/customers
```

## Author

**Niño Kriebel C. Olmo**

