# Stockroom Warehouse API

An Express API for managing warehouse products, suppliers, inventory levels, and stock movement history. MongoDB is used for persistence, and the API is documented with OpenAPI/Swagger.

## Requirements

- Node.js with npm
- MongoDB running locally or a MongoDB connection URI

## Setup

From this directory, install dependencies:

```sh
npm install
```

Create your local environment file by copying the example:

```powershell
Copy-Item .env.example .env
```

Edit `.env` if needed. In particular, set `MONGO_URI` to a reachable MongoDB instance. The default example uses a local database named `warehouse`.

Start the API in development mode:

```sh
npm run dev
```

Or start it without the file watcher:

```sh
npm start
```

By default, the API listens at `http://localhost:5000`.

## Environment variables

| Variable | Required | Default | Description |
| --- | --- | --- | --- |
| `PORT` | No | `5000` | Port used by the HTTP server. |
| `CLIENT_ORIGIN` | No | `http://localhost:5173` | Allowed browser origin for CORS. |
| `MONGO_URI` | Yes | None in the application | MongoDB connection string. |

Keep credentials and machine-specific values in `.env`; it is excluded from Git. `.env.example` is a safe template and is intentionally trackable.

## API

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/api/health` | Check API health. |
| `GET` | `/api/dashboard` | Get warehouse metrics and recent activity. |
| `GET` | `/api/products` | List products; supports `search`, `category`, `stock`, `page`, and `limit` query parameters. |
| `POST` | `/api/products` | Create a product; may include `initialQuantity`. |
| `GET` | `/api/products/:id` | Get a product. |
| `PATCH` | `/api/products/:id` | Update product details. Use stock movements to change quantity. |
| `DELETE` | `/api/products/:id` | Delete a product and its stock history. |
| `GET` | `/api/suppliers` | List suppliers. |
| `POST` | `/api/suppliers` | Create a supplier. |
| `PATCH` | `/api/suppliers/:id` | Update a supplier. |
| `DELETE` | `/api/suppliers/:id` | Delete a supplier that is not linked to products. |
| `GET` | `/api/stock-movements` | List stock movements; supports `product`, `page`, and `limit` query parameters. |
| `POST` | `/api/stock-movements` | Record an `in`, `out`, or `adjustment` movement. |

JSON request bodies are expected for create and update operations. The API applies a 1 MB JSON body limit and rate-limits `/api` requests.

## API documentation

Start the server, then open:

- Swagger UI: `http://localhost:5000/api-docs`
- OpenAPI JSON: `http://localhost:5000/api-docs.json`

## Development notes

The `npm test` script is currently a placeholder and does not run a test suite.
# warehouse
