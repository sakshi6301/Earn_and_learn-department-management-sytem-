# Earn & Learn Samiti Portal (MERN)

This project is now structured as a MERN application:

- `client/` - React frontend built with Vite
- `server/` - Express API with MongoDB models via Mongoose

## Roles

- `provider`
  - register and login
  - submit work opportunities
  - view only their own work and approved student counts

- `student`
  - register and login
  - view only approved jobs
  - apply for work and track personal applications

- `head`
  - register and login
  - approve or reject jobs
  - approve or reject student applications
  - view provider summary

## Workflow

1. A provider submits a work opportunity with money, hours, work type, location, description, and student count.
2. The department head reviews the job.
3. Approved jobs become visible to students.
4. Students apply to approved jobs.
5. The department head reviews student applications.
6. Approved student counts are visible in provider and department summary views.

## Demo accounts seeded by the backend

- Department head: `head@samiti.org` / `head123`
- Provider: `provider@trust.org` / `provider123`
- Student: `student@college.edu` / `student123`

## Local setup

1. Install dependencies:
   - `npm run install:all`
2. Copy environment files if needed:
   - `server/.env.example` to `server/.env`
   - `client/.env.example` to `client/.env`
3. Start MongoDB locally.
4. Run the app:
   - `npm run dev`

## Stack details

- Frontend: React, Vite, Axios
- Backend: Node.js, Express, Mongoose
- Auth: JWT + role-based route protection
- Database: MongoDB
