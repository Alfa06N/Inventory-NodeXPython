# Microservices Architecture - Node API Gateway + Python (FastAPI) Backend 🔧

## Table of Contents

- [Project Overview](#project-overview)
- [Architecture](#architecture)
- [Prerequisites](#prerequisites)
- [Quick Start (Docker Compose)](#quick-start-docker-compose)
- [Local Development](#local-development)
- [API Reference](#api-reference)
- [Environment Variables](#environment-variables)
- [Database](#database)
- [Testing](#testing)

---

## Project Overview ✨

This repository implements a simple microservice architecture composed of:

- A Node.js API Gateway (Express) that exposes an external REST API on port **3000**.
- A Python FastAPI service that handles product data and stock movements on port **8000**.

Services are composed with Docker for easy development and deployment.

---

## Architecture 🏗️

- `api-gateway-node/` — Express gateway listening on port **3000**. Routes include `/products`, `/product`, and `/product/:id/...`.
- `backend-python/` — FastAPI app exposing product management endpoints on port **8000**.
- `docker-compose.yml` wires the services together and can use **MySQL** for persistence (see the Database section for configuration and examples).

---

## Prerequisites ✅

- Docker & Docker Compose (recommended)
- Or, for local development:
  - Node.js 18+ and npm
  - Python 3.11+ and pip

---

## Quick Start (Docker Compose) 🚀

1. Build and run:

```bash
docker compose up --build
```

- Node gateway will be available at `http://localhost:3000`.
- Python API will be available at `http://localhost:8000`.

2. Stop and remove containers:

```bash
docker compose down
```

---

## Local Development (without Docker) 🖥️

Python service:

1. Create and activate a virtual environment (Windows example):

```powershell
python -m venv .venv
.\.venv\Scripts\activate
```

2. Install dependencies and run:

```bash
pip install -r backend-python/requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Node gateway:

1. Install dependencies and run:

```bash
cd api-gateway-node
npm install
npm run dev
```

2. Ensure `PYTHON_SERVICE_URL` points to the Python service when running locally. For example (Windows PowerShell):

```powershell
$env:PYTHON_SERVICE_URL = "http://localhost:8000"
```

---

## API Reference 📡

All examples below use the Node gateway at `http://localhost:3000`.

- GET `/products`

  - List all products
  - Example: `curl http://localhost:3000/products`

- POST `/product`
  - Create a product
  - Body example:

```json
{
  "name": "Sample Product",
  "cost_price": 12.5,
  "current_stock": 100
}
```

- PUT `/product/{id}`

  - Update product fields (partial updates supported)

- DELETE `/product/{id}`

  - Delete a product

- PUT `/product/{id}/stock-decrease`

  - Decrease stock by `discount` amount
  - Body: `{ "discount": 2 }`

- PUT `/product/{id}/stock-increase`

  - Increase stock by `increase` amount
  - Body: `{ "increase": 10 }`

- GET `/product/{id}/movements`
  - List stock movements for a product

Note: The Node gateway forwards requests to the Python service which persists data in **MySQL** (configured via the `DATABASE_URL` environment variable).

---

## Environment Variables 🌐

- `api-gateway-node`:
  - `PYTHON_SERVICE_URL` — URL of the Python microservice (default in Docker Compose: `http://python-api:8000`).
- `backend-python`:
  - `DATABASE_URL` — SQLAlchemy database URL (e.g., `mysql+pymysql://user:password@mysql:3306/app_db`). When using Docker Compose, add a MySQL service and set the `DATABASE_URL` to point to it (example in the Database section).

---

## Database 🗃️

- Uses **MySQL** for persistence (recommended for development and production setups).
- Example Docker Compose MySQL service to add to `docker-compose.yml`:

```yaml
mysql:
  image: mysql:8.0
  environment:
    MYSQL_ROOT_PASSWORD: example
    MYSQL_DATABASE: app_db
    MYSQL_USER: user
    MYSQL_PASSWORD: secret
  ports:
    - "3306:3306"
  volumes:
    - mysql-data:/var/lib/mysql
```

- Set the `DATABASE_URL` to point to the MySQL service, for example:

```
DATABASE_URL=mysql+pymysql://user:secret@mysql:3306/app_db
```

- The application uses SQLAlchemy and `pymysql` (already included in `requirements.txt`) to connect to MySQL.
- Database tables are created automatically when the app runs. There are no migration scripts included—consider adding Alembic for schema migrations in the future.

- Tip: Persist MySQL data via a named Docker volume (`mysql-data`) so your database is retained between container restarts.

---

## Testing 🧪

- There are no automated tests included currently. Consider adding:
  - `pytest` for Python unit/integration tests
  - `Jest` or `Vitest` for Node tests

---

By Alfa06N, made with ❤️
