# Meet.io - Expert Session Booking Platform

A real-time expert session booking system built with React, Node.js, Express, and MongoDB.

## Features

- **Expert Listing**: Browse experts with search, category filtering, and pagination.
- **Real-Time Availability**: See live slot status updates via Socket.io.
- **Instant Booking**: Book sessions with immediate confirmation.
- **Double-Booking Prevention**: Robust concurrency handling with database constraints and transactions.
- **My Bookings**: View booking history and status.
- **Responsive Design**: Mobile-first UI with Tailwind CSS (v3).

## Tech Stack

- **Frontend**: React (Vite), Tailwind CSS v3, Socket.io Client, Axios, React Hot Toast
- **Backend**: Node.js, Express, MongoDB (Mongoose), Socket.io
- **Database**: MongoDB (Atlas or Local/Memory fallback)

## Getting Started

### Prerequisites

- Node.js (v18+)
- MongoDB (optional, falls back to in-memory)

### Installation

1.  **Clone variables**:
    The project is already set up.

2.  **Install dependencies**:

    ```bash
    # Install backend dependencies
    cd server
    npm install

    # Install frontend dependencies
    cd ../client
    npm install
    ```

3.  **Run the application**:

    You can run both servers in separate terminals.

    **Backend**:
    ```bash
    cd server
    npm start
    # Runs on http://localhost:5000
    ```

    **Frontend**:
    ```bash
    cd client
    npm run dev
    # Runs on http://localhost:5173
    ```

## Environment Variables

### Backend (`server/.env`)
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/meetio
CLIENT_URL=http://localhost:5173
```

## API Endpoints

- `GET /api/experts` - List experts
- `GET /api/experts/:id` - Get expert details
- `POST /api/bookings` - Create a booking
- `GET /api/bookings` - Get user bookings
- `PATCH /api/bookings/:id/status` - Update booking status

## Troubleshooting

- **Tailwind CSS**: Using v3 for maximum compatibility.
- **MongoDB**: If no local MongoDB is found, it starts an in-memory instance automatically.
