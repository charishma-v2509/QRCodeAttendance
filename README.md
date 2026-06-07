# QR Code Attendance System

A proxy-free, session-based attendance tracker using dynamically generated QR codes — built with the MERN stack. Each session gets a unique QR code that expires, making buddy punching impossible.

## The problem it solves

Traditional attendance systems are slow, error-prone, and easy to game (proxy entries). This system generates a **unique QR code per session** that users scan via webcam or mobile to mark attendance. Admins get searchable, filterable reports — no manual entry.

---

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | React 19, vanilla CSS |
| Backend | Node.js + Express.js |
| Database | MongoDB + Mongoose |
| QR | `qrcode` (generation) + `react-qr-reader` (scanning) |
| Auth | JWT |

---

## Features

- **Session management** — create sessions, each generates a unique QR code
- **QR scanning** — works via webcam or mobile camera
- **Proxy prevention** — QR codes are session-specific and time-bound
- **Attendance reports** — searchable by name, filterable by session, sortable by date
- **JWT auth** — all admin routes protected
- **Responsive UI** — works on all screen sizes

---

## Architecture

```
QRCodeAttendance/
├── backend/
│   ├── routes/      # Auth, session, attendance API routes
│   ├── models/      # MongoDB schemas (User, Session, Attendance)
│   └── middleware/  # JWT auth middleware
└── frontend/
    ├── components/  # Login, Dashboard, QR scanner, Report table
    └── pages/
```

---

## Local setup

### Backend

```bash
cd backend
npm install
```

Create `.env`:
```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5000
```

```bash
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm start
```

---

## Security

- JWT protects all sensitive admin routes
- Input validation and sanitization on all endpoints
- Session data tied to authenticated admin accounts only