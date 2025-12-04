# ProctorX Backend Server

This directory contains the backend structure for the ProctorX exam proctoring platform.

## Tech Stack
- **Runtime**: Node.js with Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT with bcrypt
- **File Storage**: AWS S3 / Cloudinary for video recordings
- **Real-time**: Socket.io for live proctoring

## Directory Structure

```
server/
├── config/           # Configuration files
├── controllers/      # Route controllers
├── middleware/       # Express middleware
├── models/           # Mongoose models
├── routes/           # API routes
├── services/         # Business logic services
├── utils/            # Utility functions
└── index.js          # Entry point
```

## Getting Started

```bash
cd server
npm install
npm run dev
```

## Environment Variables

Create a `.env` file with:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/proctorx
JWT_SECRET=your-secret-key
AWS_ACCESS_KEY_ID=your-aws-key
AWS_SECRET_ACCESS_KEY=your-aws-secret
AWS_BUCKET_NAME=proctorx-recordings
```
