# SOMBA Kickstart AI Advanced

A comprehensive 12-week guided program application with user management, admin dashboard, and AI coaching.

## Features

- **User Management**: Three role levels (Admin, Active Student, Completed Student)
- **Admin Dashboard**: User tracking, content scheduling, AI insights
- **Week-by-Week Content**: Drip content release over 12 weeks
- **AI Coach**: Integrated AI assistance for participants
- **Progress Tracking**: Persistent user progress with cloud sync

## Tech Stack

- **Frontend**: React, Vite, Tailwind CSS, Framer Motion
- **Backend**: Node.js, Express, SQLite, JWT Authentication

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/sigruncom/kickstart-advanced.git
cd kickstart-advanced
```

2. **Install frontend dependencies**
```bash
npm install
```

3. **Install backend dependencies**
```bash
cd backend
npm install
```

4. **Set up environment variables**

For the backend, copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

5. **Seed the database**
```bash
npm run seed
```

6. **Start the backend server**
```bash
npm start
```

7. **In a new terminal, start the frontend**
```bash
cd ..
npm run dev
```

The app will be available at `http://localhost:5173`

## Default Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@sigrun.com | Admin123! |
| Student | student1@example.com | Student123! |

## Environment Variables

### Frontend (.env)

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | `http://localhost:3001/api` |

### Backend (backend/.env)

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `3001` |
| `JWT_SECRET` | JWT signing secret | (required) |
| `ADMIN_EMAIL` | Default admin email | `admin@sigrun.com` |
| `ADMIN_PASSWORD` | Default admin password | `Admin123!` |
| `OPENAI_API_KEY` | OpenAI API key for AI insights | (optional) |

## Deployment

### Frontend Deployment

When deploying the frontend, set the `VITE_API_URL` environment variable to your deployed backend URL:

```bash
VITE_API_URL=https://your-backend-url.com/api
```

### Backend Deployment

1. Ensure `JWT_SECRET` is set to a secure random string
2. Configure `CORS` for your frontend domain
3. For production, consider using PostgreSQL instead of SQLite

## License

© 2026 Sigrun GmbH. All rights reserved.
