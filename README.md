# EkubCircle (ዕቁብ) 🇪🇹

[![.NET 8](https://img.shields.io/badge/.NET-8.0-512BD4?logo=dotnet&logoColor=white)](https://dotnet.microsoft.com/)
[![Angular](https://img.shields.io/badge/Angular-20-DD0031?logo=angular&logoColor=white)](https://angular.dev/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?logo=docker&logoColor=white)](https://www.docker.com/)
[![Architecture](https://img.shields.io/badge/Architecture-Clean%20Architecture-blue)](#architecture)

**EkubCircle** is a modern, transparent digital platform for traditional Ethiopian **Ekub** (ዕቁብ) — Rotating Savings and Credit Associations (ROSCAs). It brings trust, structure, and accountability to community savings through automated round management, identity verification via Fayda National ID simulation, and real-time financial tracking.

---

## 📖 Table of Contents

- [About Ekub](#about-ekub)
- [Key Features](#key-features)
- [Architecture & Tech Stack](#architecture--tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [1. Database Setup](#1-database-setup)
  - [2. Backend Setup](#2-backend-setup)
  - [3. Frontend Setup](#3-frontend-setup)
- [Demo Credentials](#demo-credentials)
- [API Endpoints](#api-endpoints)
- [Ekub Business Rules & Workflow](#ekub-business-rules--workflow)
- [License](#license)

---

## 💡 About Ekub

An **Ekub** (ዕቁብ) is a peer-to-peer rotating savings scheme deeply rooted in Ethiopian culture. Members pool a fixed amount of money on a periodic basis (e.g., weekly or monthly), and during each round, one member receives the entire aggregated pot until all participants have had their turn.

**EkubCircle** digitizes this practice by removing pen-and-paper disputes, ensuring fair and locked payout rotations, verifying participant identities, and maintaining a verifiable audit trail for payments and payouts.

---

## ✨ Key Features

- **National Identity & Security**:
  - Secure registration and JWT bearer authentication.
  - Simulated **Fayda National ID (FAN)** verification with one-time password (OTP) workflow.
  - BCrypt password hashing and SHA-256 FAN pseudonymization.

- **Circle (Ekub) Lifecycle Management**:
  - Create customized circles with tailored contribution sums, frequency (Weekly/Monthly), and member caps.
  - Browse public open circles with search and frequency filters.
  - Request to join open circles or allow organizers to invite/add members.
  - Locking mechanism on circle start that secures the member roster and establishes the fixed payout order.

- **Round & Pot Tracking**:
  - Transparent turn-based round progression matching the predetermined payout queue.
  - Contribution recording per member for each round.
  - Real-time calculation of collected funds vs. expected pot size.

- **Payout & Completion Guarantees**:
  - Strict business rule enforcement: payouts can only proceed once all members have contributed for the round.
  - Guarantees each member receives the pot exactly once across the circle's lifetime.
  - Automatic circle completion upon fulfillment of the final round payout.
  - Detailed historical audit log for all past rounds and distributions.

---

## 🏛 Architecture & Tech Stack

### System Overview

```text
EkubCircleFrontend (Angular 20)
       │ (HTTP via dev proxy /api/*)
       ▼
EkubCircle.API (ASP.NET Core 8 Web API)
       │
       ├──► Application  (Use cases, DTOs, Service Interfaces)
       │         │
       │         ▼
       │      Domain     (Entities, Enums, Zero external dependencies)
       │         ▲
       └──► Infrastructure (EF Core, Npgsql, JWT, Hashing)
                 │
                 ▼
          PostgreSQL 16 (Docker / Local)
```

### Technologies

| Layer | Technology |
|---|---|
| **Frontend** | Angular 20, TypeScript 5.9, RxJS 7.8, Standalone Components |
| **Backend** | ASP.NET Core 8 Web API, C# 12 |
| **Architecture** | Clean Architecture (Domain-Driven boundaries) |
| **Database & ORM** | PostgreSQL 16, Entity Framework Core 8 (Npgsql) |
| **Authentication** | JWT Bearer Tokens, BCrypt, SHA-256 |
| **API Documentation** | Swagger / OpenAPI (Swashbuckle) |
| **Containerization** | Docker & Docker Compose |

---

## 📂 Project Structure

```text
EkubCircle/
├── API/                          # Web API entry point, controllers & middleware
│   ├── Controllers/              # Auth, Circles, Rounds controllers
│   ├── Extensions/               # Claim helpers & middleware extensions
│   ├── Middleware/               # Global exception handling
│   ├── Program.cs                # App host configuration & DI registration
│   └── appsettings.json          # DB connection strings & JWT settings
├── Application/                  # Core application business logic
│   ├── DTOs/                     # Request and response models
│   ├── Interfaces/               # Service & repository abstractions
│   └── Services/                 # AuthService, CircleService, RoundService
├── Domain/                       # Enterprise domain layer
│   ├── Entities/                 # User, Circle, CircleMembership, Round, Payment, Payout
│   └── Enums/                    # CircleStatus, RoundStatus, Frequency, etc.
├── Infrastructure/               # External concerns and data access
│   ├── Extensions/               # Infrastructure DI registrations
│   ├── Persistence/              # AppDbContext & DbSeeder
│   └── Services/                 # JwtTokenService, SecurityServices
├── EkubCircleFrontend/           # Angular frontend SPA
│   ├── src/
│   │   ├── app/
│   │   │   ├── pages/            # Login, Register, Dashboard, Circle details, etc.
│   │   │   ├── api.service.ts    # Centralized HTTP client
│   │   │   ├── auth.service.ts   # Session & auth state management
│   │   │   └── models.ts         # TypeScript interfaces matching backend DTOs
│   │   ├── index.html
│   │   └── styles.css            # Responsive layout & theme styles
│   ├── angular.json
│   ├── package.json
│   └── proxy.conf.json           # Angular dev proxy forwarding /api to port 5000
├── docker-compose.yml            # Docker Compose specification for PostgreSQL
├── schema.sql                    # Standalone PostgreSQL DDL initialization script
└── EkubCircle.sln                # .NET Solution file
```

---

## 🚀 Getting Started

### Prerequisites

Ensure the following tools are installed on your machine:
- [.NET 8.0 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)
- [Node.js](https://nodejs.org/) (v20+ or v22 LTS recommended) and `npm` (v10+)
- [Docker](https://www.docker.com/) and [Docker Compose](https://docs.docker.com/compose/) (or a local PostgreSQL instance)

---

### 1. Database Setup

Spin up the PostgreSQL database container with Docker Compose:

```bash
docker compose up -d postgres
```

The database will be exposed on `localhost:5432` with:
- **Database:** `ekubcircle`
- **User:** `postgres`
- **Password:** `postgres`

> **Note:** When running in Development mode, the application automatically seeds the database with initial users and an open circle via `DbSeeder`. Alternatively, you can apply migrations using `dotnet ef database update --project Infrastructure --startup-project API` or execute `schema.sql`.

---

### 2. Backend Setup

1. Restore dependencies and run the API:

```bash
dotnet restore
dotnet run --project API
```

2. The API will start (defaulting to `http://localhost:5000` / `https://localhost:5001`).
3. View the interactive Swagger UI at:
   - `http://localhost:5000/swagger` or `https://localhost:5001/swagger`

---

### 3. Frontend Setup

1. Navigate to the frontend directory:

```bash
cd EkubCircleFrontend
```

2. Install dependencies:

```bash
npm install
```

3. Start the Angular development server:

```bash
npm start
```

4. Open your browser and navigate to:
   - `http://localhost:4200`

> The frontend dev server is preconfigured with `proxy.conf.json` to proxy all `/api/*` calls directly to `http://localhost:5000`.

---

## 🔑 Demo Credentials

The development database seeds two pre-verified accounts:

| Role | Email | Password | Fayda Status |
|---|---|---|---|
| **Organizer** | `organizer@hackathon.local` | `Organizer123!` | Verified |
| **Member** | `member@hackathon.local` | `Member123!` | Verified |

---

## 📡 API Endpoints

### Authentication (`/api/auth`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|:---:|
| `POST` | `/api/auth/register` | Register a new user account & initiate OTP | No |
| `POST` | `/api/auth/verify-otp` | Verify simulated Fayda OTP & obtain JWT | No |
| `POST` | `/api/auth/login` | Sign in with email & password | No |

### Circles (`/api/circles`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|:---:|
| `POST` | `/api/circles` | Create a new circle (verified users only) | Yes |
| `GET` | `/api/circles/available` | Browse open circles with filters | Yes |
| `GET` | `/api/circles/mine` | List circles the user organizes or participates in | Yes |
| `GET` | `/api/circles/{id}` | Retrieve comprehensive circle details & roster | Yes |
| `POST` | `/api/circles/{id}/join` | Join an open circle as a member | Yes |
| `POST` | `/api/circles/{id}/members` | Organizer manually adds an existing user | Yes |
| `POST` | `/api/circles/{id}/start` | Lock circle, assign payout orders, and open round 1 | Yes |

### Rounds & Payments (`/api`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|:---:|
| `GET` | `/api/circles/{circleId}/current-round` | Retrieve currently active round & payment status | Yes |
| `GET` | `/api/circles/{circleId}/rounds` | Retrieve all rounds in the circle | Yes |
| `GET` | `/api/circles/{circleId}/history` | Retrieve past payout history and summaries | Yes |
| `POST` | `/api/rounds/{roundId}/payments/{membershipId}` | Record member contribution payment | Yes (Organizer) |
| `POST` | `/api/circles/{circleId}/payout` | Disburse current round pot to scheduled beneficiary | Yes (Organizer) |

---

## 🔄 Ekub Business Rules & Workflow

```text
[1. Create Circle]
       │
       ▼
[2. Join Members] ──────► Open Status (Organizer can add/remove members)
       │
       ▼
[3. Start Circle] ──────► Locks member list, assigns randomized/fixed payout order,
       │                   creates Round 1 with Receiver = Order #1
       ▼
 ┌───► [4. Collect Round Payments]
 │             │
 │             ├── Check: All active members contributed?
 │             └── If No: Cannot payout yet.
 │             │
 │             ▼
 │     [5. Payout Current Round] ─► Receiver receives pot, marked as PaidOut
 │             │
 └─────────────┼─────────────── Round < MemberCount? (Open next round)
               ▼
       [6. Circle Completed] ────► All members received payout exactly once
```

1. **Fayda Verification**: Only verified users are authorized to create or join circles.
2. **Locked Roster**: Once the organizer starts a circle, the membership is locked — no members can leave or join, ensuring financial predictability.
3. **Fixed Payout Queue**: Each member is assigned a unique payout turn ($1 \dots N$). Round $k$ always designates the member with payout order $k$ as the beneficiary.
4. **All-Paid Prerequisite**: A round cannot be paid out until all participants have their payment recorded by the organizer.
5. **No Double Payouts**: The system verifies that no member can ever receive more than one payout per circle cycle.
6. **Cycle Completion**: Once the final member receives their payout, the circle transitions into `Completed` status.

---

## 📄 License

This project is created for hackathon and open-source demonstration purposes. Free to use and adapt under the [MIT License](LICENSE).
