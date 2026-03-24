# Deploy This Project

This repo is set up to deploy as:

- `client/` -> static frontend
- `todo/` -> Spring Boot API

## Recommended setup

- Frontend: Vercel
- Backend: Render
- Database: Neon Postgres or any hosted PostgreSQL database

## 1. Deploy the backend

Use `render.yaml` or create a Render web service from `todo/`.

Required backend environment variables:

- `DB_URL`
- `DB_USERNAME`
- `DB_PASSWORD`
- `SERVER_PORT=8000`
- `CORS_ALLOWED_ORIGINS=https://your-frontend-domain.vercel.app`

Optional backend environment variables:

- `APP_NAME=todo-api`
- `JPA_HIBERNATE_DDL_AUTO=update`
- `JPA_DATABASE_PLATFORM=org.hibernate.dialect.PostgreSQLDialect`

## 2. Deploy the frontend

Create a Vercel project from `client/`.

Set this frontend environment variable before building:

- `VITE_API_BASE_URL=https://your-backend-domain.onrender.com/api`

Build settings:

- Install command: `npm ci`
- Build command: `npm run build`
- Output directory: `dist`

## 3. Connect frontend and backend

After Vercel gives you a frontend URL:

1. Put that URL into the backend `CORS_ALLOWED_ORIGINS`.
2. Put the backend `/api` URL into the frontend `VITE_API_BASE_URL`.
3. Redeploy both services.

## Local development

- Copy `client/.env.example` to `client/.env`
- Copy `todo/.env.example` to `todo/.env`

Frontend local API default:

- `http://localhost:8000/api`

## Notes

- The frontend now reads its API URL from `VITE_API_BASE_URL`.
- The backend CORS allowlist now comes from `CORS_ALLOWED_ORIGINS`.
- If you deploy the API somewhere other than Render, keep the same env vars.
