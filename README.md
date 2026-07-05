# Product Catalog

A full-stack product catalog application built with:

- **Backend**: ASP.NET Core Web API on .NET 9
- **Frontend**: React + TypeScript + Vite
- **Data source**: DummyJSON

The backend acts as the API layer for the frontend and handles authentication, product data, and favorites.

## Project Structure

- `backend/` - ASP.NET Core solution
- `frontend/` - React application

## Prerequisites

Make sure you have the following installed:

- [.NET 9 SDK](https://dotnet.microsoft.com/download)
- [Node.js 20+](https://nodejs.org/)
- npm

## Environment Setup

### Backend

The backend uses `appsettings.json` and `appsettings.Development.json` for configuration.

Important values you may want to review:

- `ConnectionStrings:DefaultConnection` - SQLite database path
- `DummyJson:BaseUrl` - external API base URL
- `Jwt:Issuer` - token issuer
- `Jwt:Audience` - token audience
- `Jwt:SigningKey` - signing key used for JWT generation and validation
- `Cors:AllowedOrigins` - frontend origin allowed to call the API

### Frontend

The frontend reads environment variables from `frontend/.env`.

Example:

```env
VITE_API_BASE_URL=https://localhost:7208/api
```

If needed, update this value to match your local backend URL.

The frontend stores the auth token in browser local storage under `pc_token`.

## Installation

### Backend

From the `backend` folder:

```bash
dotnet restore
```

### Frontend

From the `frontend` folder:

```bash
npm install
```

## Running the Application

### Start the Backend

From the `backend` folder:

```bash
dotnet run --project src/ProductCatalog.Api --launch-profile https
```

The backend is configured to run on:

- `https://localhost:7208`
- `http://localhost:5090`

### Start the Frontend

From the `frontend` folder:

```bash
npm run dev
```

Vite usually starts the app on:

- `http://localhost:5173`

## Notes on Configuration

If the frontend cannot reach the backend, check these settings first:

- `frontend/.env` contains the correct `VITE_API_BASE_URL`
- backend CORS allows the frontend origin
- backend is running before you log in or load protected pages

If authentication is not working, confirm:

- the backend JWT settings are valid
- the token is being returned from the login endpoint
- the browser still has the token saved in `pc_token`

## AI Tool Usage

AI tools were used across the project for scaffolding, coding and documentation because of faster development.

- backend scaffold creation, including the solution, projects, and dependency injection wiring
- frontend scaffold creation
- product list feature work, including the backend endpoint and the frontend list page with pagination
- product detail feature work, including the backend endpoint and the `/products/:id` route
- combination of search, category and price filtering with debounce for search
- preserving list state when navigating back
- Swagger documentation
- memory caching implementation
- authentication and favorites, including DummyJSON login, token handling, EF Core and SQLite usage on the backend, and the frontend login and protected-route flow

## Build

### Backend

```bash
dotnet build
```

### Frontend

```bash
npm run build
```
