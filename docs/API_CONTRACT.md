# API Contract Specification

This document details the exact HTTP API contract between the **AlphaDrafts Admin App** and the **Backend API**.

All paths are proxied via Next.js rewrites: client calls relative path `/v1/*`, which Next.js forwards to `${BACKEND_URL}/v1/*`.

---

## 1. Authentication Endpoints

### 1.1 `GET /v1/auth/csrf-token`
* **Purpose:** Issues a CSRF token for unsafe mutative requests.
* **Authentication:** None.
* **Headers:** None required.
* **Response:**
  * Headers: `Set-Cookie: csrf_token=<token>; Path=/; SameSite=Lax`
  * Body:
  ```json
  { "status": "success", "message": "CSRF token issued", "data": { "token": "..." } }
  ```

### 1.2 `POST /v1/auth/login`
* **Purpose:** Authenticates administrator with email & password.
* **Authentication:** None (requires `X-CSRF-Token`).
* **Request Body:**
  ```json
  {
    "email": "admin@alphadrafts.com",
    "password": "SecurePassword123!"
  }
  ```
* **Response:**
  * Headers:
    * `Set-Cookie: access_token=<jwt>; Path=/; HttpOnly; SameSite=Lax`
    * `Set-Cookie: refresh_token=<jwt>; Path=/; HttpOnly; SameSite=Lax`
  * Body:
  ```json
  {
    "status": "success",
    "message": "Login successful",
    "data": {
      "uid": "usr_12345",
      "email": "admin@alphadrafts.com",
      "fullName": "Jane Doe"
    }
  }
  ```

### 1.3 `POST /v1/auth/logout`
* **Purpose:** Revokes active refresh token and clears session cookies.
* **Authentication:** Cookie (`access_token`, requires `X-CSRF-Token`).
* **Response:**
  * Headers: Clears `access_token` and `refresh_token` cookies.
  * Body: `{ "status": "success", "message": "Logged out" }`

### 1.4 `POST /v1/auth/refresh`
* **Purpose:** Rotates access and refresh tokens when access token expires.
* **Authentication:** Cookie (`refresh_token`).
* **Response:** Sets fresh `access_token` and `refresh_token` cookies.

### 1.5 `POST /v1/auth/forgot-password`
* **Purpose:** Sends password-reset email.
* **Authentication:** None (requires `X-CSRF-Token`).
* **Request Body:** `{ "email": "admin@alphadrafts.com" }`
* **Response:** `{ "status": "success", "message": "Reset email sent" }`

### 1.6 `POST /v1/auth/reset-password`
* **Purpose:** Confirms password reset with out-of-band token.
* **Authentication:** None (requires `X-CSRF-Token`).
* **Request Body:**
  ```json
  {
    "token": "oob_code_string",
    "password": "NewSecurePassword123!"
  }
  ```
* **Response:** `{ "status": "success", "message": "Password updated successfully" }`

### 1.7 `POST /v1/auth/verify-email`
* **Purpose:** Verifies email using verification token.
* **Authentication:** None (requires `X-CSRF-Token`).
* **Request Body:** `{ "token": "oob_code_string" }`
* **Response:** `{ "status": "success", "message": "Email verified" }`

---

## 2. User & Admin Identity Endpoints

### 2.1 `GET /v1/users/me`
* **Purpose:** Returns current authenticated user session details and roles.
* **Authentication:** Cookie (`access_token`).
* **Response:**
  ```json
  {
    "status": "success",
    "data": {
      "uid": "usr_12345",
      "email": "admin@alphadrafts.com",
      "fullName": "Jane Doe",
      "roles": ["admin", "super_admin"],
      "emailVerified": true
    }
  }
  ```

### 2.2 `PATCH /v1/users/update-password`
* **Purpose:** Updates authenticated administrator's password.
* **Authentication:** Cookie (`access_token`, requires `X-CSRF-Token`).
* **Request Body:** `{ "password": "NewPassword123!" }`
* **Response:** `{ "status": "success", "message": "Password updated" }`

---

## 3. Administrative Product Data Endpoints

All endpoints below require an authenticated admin session (`access_token` cookie with `"admin"` or `"super_admin"` role).

### 3.1 `GET /v1/admin/metrics`
* **Purpose:** Provides dashboard summary statistics.
* **Response:**
  ```json
  {
    "status": "success",
    "message": "Metrics fetched",
    "data": {
      "noOfUsers": 1247,
      "noOfActiveStarterSubscriptions": 320,
      "noOfActiveStudentSubscriptions": 185,
      "noOfActiveProfessionalSubscriptions": 92,
      "moneyMadeFromStudentPlan": 18499,
      "moneyMadeFromProfessionalPlan": 27508,
      "noOfProjectsCreated": 4120,
      "noOfProjectsCompleted": 2890,
      "noOfInstructionAnalyserRan": 7340
    }
  }
  ```

### 3.2 `GET /v1/admin/users`
* **Purpose:** Paginated user directory.
* **Query Parameters:**
  * `skip` (number, e.g. `0`, `50`)
  * `take` (number, default `50`)
  * `sort` (`"created_at"` | `"updated_at"`)
* **Response:**
  ```json
  {
    "status": "success",
    "data": {
      "data": [
        {
          "id": "u1",
          "user_id": "u1",
          "name": "Alice Johnson",
          "email": "alice@example.com",
          "phone_number": "+1234567890",
          "avatar": "",
          "roles": ["user"],
          "subscription": { "id": "sub1", "name": "Professional" },
          "currentPlan": "Professional",
          "joinedOn": { "_seconds": 1715000000, "_nanoseconds": 0 }
        }
      ],
      "totalCount": 1247,
      "skip": 0,
      "take": 50,
      "hasMore": true
    }
  }
  ```

### 3.3 `GET /v1/admin/projects`
* **Purpose:** Paginated project directory.
* **Query Parameters:**
  * `skip` (number)
  * `take` (number, default `50`)
  * `status` (`"All"` | `"draft"` | `"in_progress"` | `"completed"` | `"archived"`)
* **Response:**
  ```json
  {
    "status": "success",
    "data": {
      "data": [
        {
          "id": "p1",
          "name": "Literature Review - AI in Education",
          "creatorName": "Alice Johnson",
          "creatorId": "u1",
          "status": "completed",
          "type": "literature_review",
          "createdAt": { "_seconds": 1715100000, "_nanoseconds": 0 }
        }
      ],
      "totalCount": 4120,
      "skip": 0,
      "take": 50,
      "hasMore": true
    }
  }
  ```

### 3.4 `GET /v1/admin/subscriptions`
* **Purpose:** Paginated subscription and billing log.
* **Query Parameters:**
  * `skip` (number)
  * `take` (number, default `50`)
  * `name` (optional: `"Starter"` | `"Student"` | `"Professional"`)
  * `status` (optional: `"active"` | `"inactive"` | `"failed"`)
  * `order` (`"desc"` | `"asc"`)
* **Response:**
  ```json
  {
    "status": "success",
    "data": {
      "data": [
        {
          "id": "sub1",
          "userName": "Alice Johnson",
          "userEmail": "alice@example.com",
          "planName": "Professional",
          "amountPaid": 2999,
          "currency": "USD",
          "status": "active",
          "startedAt": { "_seconds": 1714000000, "_nanoseconds": 0 },
          "expiresAt": { "_seconds": 1716600000, "_nanoseconds": 0 }
        }
      ],
      "totalCount": 597,
      "skip": 0,
      "take": 50,
      "hasMore": true
    }
  }
  ```

