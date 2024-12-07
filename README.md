# Real-Time Polling Application

## Overview

A full-stack real-time polling application featuring live voting and instant result updates.

## Features

- **Create Polls**: Easily create new polls with customizable options
- **Flexible Poll Duration**: Set polls with expiry dates or make them infinite
- **Real-Time Voting**: Instant vote updates across all connected clients
- **Live Results**: See poll results dynamically update in real-time

## Technologies Used

**Frontend:**

- Next.js
- Socket.IO Client
- Mantine

**Backend:**

- Express.js
- MongoDB (with Replica Set)
- Socket.IO

## Prerequisites

- Node.js installed (supports Corepack).
- Yarn (enabled through Corepack).

## Running Locally

### 1. Clone the Repository

```bash
git clone https://github.com/kamalyusuf/poll
cd poll
```

### 2. Set Up Environment Variables

Copy `.env.example` to `.env` in both `apps/api` and `apps/web` directories and fill in the required variables:

**API Environment Variables:**

- `PORT`: Port for the Express server
- `WEB_URL`: URL of the frontend application
- `MONGO_URL`: MongoDB connection string

**Web Environment Variables:**

- `NEXT_PUBLIC_API_URL`: URL of the backend API

### 3. Start MongoDB with Docker

```bash
docker-compose up -d
```

### 4. Install Dependencies

```bash
yarn install
```

### 5. Run the Application

```bash
yarn dev
```

The application will be available at `http://localhost:3000`

## Screenshots

### Poll Creation Page

![Poll Creation](https://iili.io/2GavQLJ.png)

### Active Polls Page

![Active Polls](https://iili.io/2Gavszg.png)

### Real-Time Results Page

![Poll Results](https://iili.io/2GavLXa.png)
