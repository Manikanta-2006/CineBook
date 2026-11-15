# 🎬 CineBook — Production-Style Cinema Hall Booking System

[![Stack](https://img.shields.io/badge/Stack-React%2018%20%7C%20Node.js%20%7C%20Express%20%7C%20MongoDB-amber.svg)](#tech-stack)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS%203.4-38bdf8.svg)](#uiux-design-system)
[![Auth](https://img.shields.io/badge/Security-JWT%20%2B%20bcrypt-emerald.svg)](#security--authentication)
[![Concurrency](https://img.shields.io/badge/Concurrency-Atomic%20Double--Booking%20Guard-orange.svg)](#double-booking-prevention-concurrency-engine)

**CineBook** is a full-stack cinema ticketing web platform built with a dark cinematic responsive UI inspired by modern movie ticket booking platforms (BookMyShow, AMC Theatres, and IMAX). It delivers an end-to-end booking journey: discovering premiere releases, viewing authentic high-resolution backdrops and trailers, browsing multi-theatre showtimes, selecting tiered seats on a curved silver screen with real-time atomic concurrency locking, completing simulated checkouts, and generating scannable digital e-tickets with QR codes.

---

## 📑 Table of Contents
1. [Key Features](#-key-features)
2. [Tech Stack](#-tech-stack)
3. [Double-Booking Prevention (Concurrency Engine)](#-double-booking-prevention-concurrency-engine)
4. [Database Models](#-database-models)
5. [Demo Accounts & Credentials](#-demo-accounts--credentials)
6. [Getting Started (Installation & Setup)](#-getting-started-installation--setup)
7. [REST API Documentation](#-rest-api-documentation)
8. [Automated Verification & Tests](#-automated-verification--tests)
9. [Project Directory Layout](#-project-directory-layout)

---

## ✨ Key Features

### 👤 Customer Experience
- **Cinematic Dark Design System**: Deep obsidian canvas (`#06070a`), glassmorphic panels, glowing amber/gold accents (`#f59e0b`), and subtle ruby red badges.
- **Movie Catalog & Premiere Showcase**: Hero banner carousel, YouTube trailer modal embed, runtime, MPAA/certificate ratings, genres, and cast gallery.
- **Multi-City & Indian Multiplex Picker**: Browse shows across **Mumbai, Delhi-NCR, Bengaluru, Hyderabad, Chennai, Kolkata, Pune, and Ahmedabad** with authentic Indian cinema chains (PVR INOX Maison Luxe, Prasads IMAX, AMB Cinemas, Cinépolis VIP) and hall amenities (IMAX Laser, Dolby Atmos 7.1, INSIGNIA Recliners).
- **Indian Rupee (₹) Pricing & Integrated GST**: Accurate seat pricing (VIP Recliner ₹580, Premium ₹320, Classic ₹190) with ₹35 convenience fees and 18% GST (CGST + SGST).
- **Indian Simulated Payment Gateway**:
  - UPI / QR simulation with Google Pay, PhonePe, Paytm, and BHIM UPI (`cinebook@okhdfcbank`).
  - RuPay, Visa, Mastercard simulated debit/credit cards.
  - Indian Net Banking (HDFC Bank, State Bank of India, ICICI Bank, Axis Bank, Kotak Mahindra).
  - Clearly labeled Test Mode indicator ensuring no real financial charges occur.
- **Digital e-Ticket & Pass**:
  - Unique alphanumeric Booking ID (e.g., `CB-9IT878647`).
  - Scannable QR code generated client-side via `qrcode.react`.
  - Printable / savable boarding pass ticket receipt.
- **User Booking History**:
  - View upcoming and past reservations.
  - Cancel upcoming bookings with atomic seat release back to the auditorium.

### 🛡️ Admin Management Console (`/admin`)
- **Executive Analytics Overview**: Total Gross Revenue, Total Bookings, Active Movies, Theatres, Screens, and Recent Bookings feed.
- **Movie CRUD**: Create new movies with poster/backdrop URLs, trailers, genres, ratings, and runtime; edit or deactivate listings.
- **Theatres & Screens CRUD**: Configure multiplexes, locations, sound systems, and hall layouts.
- **Show Scheduling Engine**: Schedule movies into specific auditoriums with date, time slots, and tier pricing.
- **Bookings Audit**: Search all platform bookings by Booking ID, customer name, movie, and filter by confirmation status.

---

## 🛠 Tech Stack

| Domain | Technology | Description |
|---|---|---|
| **Frontend** | React 18, Vite | High-performance single page app with fast HMR |
| **Styling** | Tailwind CSS 3.4, PostCSS | Modern dark cinematic aesthetics, glassmorphism, responsive utilities |
| **Icons** | Lucide React | Clean, scalable vector icons |
| **Routing** | React Router DOM v6 | Client-side routing, protected customer & admin routes |
| **State & Context** | React Context API | Global `AuthContext` and custom `ToastContext` |
| **Backend API** | Node.js, Express.js | Production-ready RESTful web service |
| **Database** | MongoDB & Mongoose ODM | Strict schemas, unique indexes, and atomic updates |
| **Security** | bcryptjs, JWT | Salted password hashing (rounds: 10) & Bearer token verification |
| **e-Ticket QR** | qrcode.react (SVG) | Scannable high-density QR verification codes |

---

## 🔒 Double-Booking Prevention (Concurrency Engine)

In movie ticketing systems, race conditions happen when two concurrent requests attempt to reserve the exact same seat simultaneously. Naive `read-then-write` logic leads to double-booking disasters.

### Atomic Conditional Execution
CineBook uses MongoDB's atomic document update operator `findOneAndUpdate` with a condition `$nin` (*not in*):

```javascript
// Step 1: Ensure none of the requested seats are already booked
const updatedShow = await Show.findOneAndUpdate(
  {
    _id: showId,
    bookedSeats: { $nin: selectedSeatCodes }, // Atomic guard: NONE of the seats can already exist
    isActive: true,
  },
  {
    $push: { bookedSeats: { $each: selectedSeatCodes } },
  },
  { new: true }
);

// Step 2: If another request booked even one of these seats a microsecond earlier,
// the query matches 0 documents and returns null atomically!
if (!updatedShow) {
  return res.status(409).json({
    success: false,
    message: 'One or more selected seats have already been booked. Please choose different seats.',
  });
}
```

- **Conflict Handling**: When a conflict is caught, the server returns an HTTP `409 Conflict`. The client alerts the user with a descriptive toast and seamlessly navigates back to the seat map to select available seats.
- **Atomic Cancellation**: When a user cancels a booking, seats are released back atomically using `$pullAll: { bookedSeats: seatCodes }`.

---

## 🗄 Database Models

1. **`User`**: `name`, `email` (unique), `password` (hashed with bcrypt), `role` (`'user'` or `'admin'`), `phone`, `avatar`.
2. **`Movie`**: `title`, `slug`, `description`, `duration`, `genres`, `language`, `releaseDate`, `certificate`, `rating`, `posterUrl`, `backdropUrl`, `trailerUrl`, `formats`, `director`, `cast`, `isFeatured`, `isActive`.
3. **`Theatre`**: `name`, `city`, `address`, `zipCode`, `amenities`, `phone`, `isActive`.
4. **`Screen`**: `theatreId`, `name`, `screenType` (`IMAX`, `Dolby Cinema`, `Standard`), `soundSystem`, `totalSeats`, `seatLayout` (`totalRows`, `totalCols`, `aisleColumns`, `tiers`).
5. **`Show`**: `movieId`, `theatreId`, `screenId`, `showDate`, `startTime`, `endTime`, `format`, `tierPricing` (`VIP Recliner`, `Premium`, `Classic`), `bookedSeats` (array of seat identifiers e.g. `['B4', 'B5']`), `isActive`.
6. **`Booking`**: `bookingId` (unique e.g. `CB-8F29A1`), `userId`, `showId`, `movieId`, `theatreId`, `screenId`, `seats` array, `pricingSummary` (subtotal, convenience fee, tax, total), `paymentDetails` (`status`, `method`, `transactionId`, `isSimulated`), `bookingStatus`, `qrPayload`.

---

## 🔑 Demo Accounts & Credentials

The seed script pre-configures two ready-to-use accounts:

| Role | Email | Password | Access Capabilities |
|---|---|---|---|
| **Platform Administrator** | `admin@cinebook.com` | `Admin@123` | Full Admin Console, CRUD Movies/Theatres/Shows, Auditing |
| **Regular Customer** | `user@cinebook.com` | `User@123` | Browse catalog, Book seats, View tickets, Cancel bookings |

> 💡 *Note: The login page also includes a "Quick Demo Fill" widget to populate credentials with a single click.*

---

## 🚀 Getting Started (Installation & Setup)

### Prerequisites
- **Node.js**: v18.0.0 or higher (Tested on Node.js v26)
- **MongoDB**: Local MongoDB instance running on default port `27017`, or a MongoDB Atlas connection URI.

### 1. Clone & Install Dependencies

From the project root:
```bash
# Install root orchestration dependencies
npm install

# Install backend dependencies
cd server && npm install

# Install frontend dependencies
cd ../client && npm install
cd ..
```

### 2. Configure Environment Variables

The server `.env` is pre-configured in `server/.env`:
```env
PORT=5001
MONGODB_URI=mongodb://localhost:27017/cinebook
JWT_SECRET=cinebook_super_secret_jwt_key_2026_cinematic
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

### 3. Seed the Database

Run the database seeder to populate sample movies (Dune 2, Oppenheimer, Interstellar, The Dark Knight, etc.), multiplex theatres, screen layouts, dynamic upcoming shows across 5 days, and demo accounts:
```bash
npm run seed
# or
cd server && node seed/seedData.js
```

### 4. Start the Application

You can start both backend and frontend concurrently from the root directory:
```bash
npm run dev
```

Or start each separately in two terminal tabs:
- **Terminal 1 (Backend API)**:
  ```bash
  cd server && npm run dev
  # Server will run at http://localhost:5001
  ```
- **Terminal 2 (Frontend Client)**:
  ```bash
  cd client && npm run dev
  # Client will run at http://localhost:5173
  ```

Open your browser at `http://localhost:5173` to experience CineBook!

---

## 📡 REST API Documentation

### Public Endpoints
- `GET /api/health` — System status & uptime check
- `GET /api/movies` — List movies (optional filters: `search`, `genre`, `format`, `status`)
- `GET /api/movies/:id` — Get single movie details
- `GET /api/movies/:id/shows` — Get shows grouped by theatre and date
- `GET /api/theatres` — List theatres (filter by `city`)
- `GET /api/theatres/cities` — Distinct list of active cities
- `GET /api/shows/:id` — Show details, screen layout, and live booked seats array
- `POST /api/auth/register` — Create new user account
- `POST /api/auth/login` — Sign in and receive JWT token

### Protected Endpoints (`Authorization: Bearer <token>`)
- `GET /api/auth/me` — Fetch logged-in user profile
- `POST /api/bookings` — Atomic seat reservation & simulated checkout
- `GET /api/bookings/my-bookings` — Customer booking history
- `GET /api/bookings/:id` — Fetch digital ticket details
- `POST /api/bookings/:id/cancel` — Cancel booking and release seats atomically

### Admin Endpoints (`Role: admin` required)
- `GET /api/admin/stats` — Platform metrics & recent bookings
- `POST /api/admin/movies` | `PUT /api/admin/movies/:id` | `DELETE /api/admin/movies/:id`
- `POST /api/admin/theatres` | `PUT /api/admin/theatres/:id` | `DELETE /api/admin/theatres/:id`
- `POST /api/admin/screens` | `PUT /api/admin/screens/:id` | `DELETE /api/admin/screens/:id`
- `POST /api/admin/shows` | `PUT /api/admin/shows/:id` | `DELETE /api/admin/shows/:id`
- `GET /api/admin/bookings` — Audit all bookings across the platform

---

## 🧪 Automated Verification & Tests

### 1. Atomic Concurrency Double-Booking Race Condition Test
Simulates two simultaneous concurrent requests attempting to book the exact same seat on the same showtime:
```bash
cd server && node test/concurrencyTest.js
```
*Output: Exactly 1 client acquires the lock (`201 Created`), while the second client receives `409 Conflict`.*

### 2. Complete End-to-End Test Suite
Tests all 12 stages of the system (Health, Movies, Shows, Auth, Booking, Concurrency Guard, History, Cancellation, Seat Release, Admin Stats & CRUD):
```bash
cd server && node test/e2eTest.js
```

### 3. Frontend Production Build Verification
```bash
cd client && npm run build
```

---

## 📁 Project Directory Layout

```
CineBook/
├── server/
│   ├── config/
│   │   └── db.js                 # Mongoose connection & error handling
│   ├── controllers/
│   │   ├── authController.js     # User registration, login, profile
│   │   ├── movieController.js    # Movies queries & shows grouping
│   │   ├── theatreController.js  # Theatres & cities lookup
│   │   ├── showController.js     # Shows & screen layouts
│   │   ├── bookingController.js  # Atomic double-booking guard & simulated checkout
│   │   └── adminController.js    # Platform metrics & CRUD operations
│   ├── middleware/
│   │   ├── authMiddleware.js     # JWT verification & RBAC admin guard
│   │   └── errorMiddleware.js    # 404 & error formatters
│   ├── models/
│   │   ├── User.js
│   │   ├── Movie.js
│   │   ├── Theatre.js
│   │   ├── Screen.js
│   │   ├── Show.js
│   │   └── Booking.js
│   ├── routes/                   # Modular Express routers
│   ├── seed/
│   │   └── seedData.js           # Comprehensive realistic database seeder
│   ├── test/
│   │   ├── concurrencyTest.js    # Race-condition double booking verification
│   │   └── e2eTest.js            # 12-stage automated end-to-end integration test
│   ├── .env
│   ├── package.json
│   └── server.js                 # Express server entry point
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/           # Navbar, Footer, ProtectedRoute
│   │   │   ├── movies/           # MovieCard, MovieHeroBanner, TrailerModal
│   │   │   ├── seats/            # CinemaScreenView, SeatGrid, SeatItem, SeatLegend
│   │   │   ├── checkout/         # SimulatedPaymentTabs
│   │   │   └── tickets/          # DigitalTicket (with QR code)
│   │   ├── context/
│   │   │   ├── AuthContext.jsx   # Global authentication state & persistence
│   │   │   └── ToastContext.jsx  # Dark mode toast notifications
│   │   ├── pages/
│   │   │   ├── HomePage.jsx
│   │   │   ├── MoviesPage.jsx
│   │   │   ├── MovieDetailsPage.jsx
│   │   │   ├── TheatresPage.jsx
│   │   │   ├── SeatBookingPage.jsx
│   │   │   ├── CheckoutPage.jsx
│   │   │   ├── BookingConfirmationPage.jsx
│   │   │   ├── UserBookingsPage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── RegisterPage.jsx
│   │   │   └── admin/
│   │   │       └── AdminDashboardPage.jsx
│   │   ├── services/
│   │   │   └── api.js            # Axios client with JWT interceptor
│   │   ├── App.jsx               # Routes definition
│   │   ├── main.jsx              # Application bootstrap
│   │   └── index.css             # Tailwind directives & glow effects
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
│
├── README.md
└── package.json                  # Root runner script
```

---

## 🎬 Enjoy CineBook!
Built with precision, atomic safety, and modern cinematic design.
