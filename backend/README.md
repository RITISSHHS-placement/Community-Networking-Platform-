# Community Networking and Events Discovery Platform — Backend

Spring Boot 3 / Java 17 backend implementing the SRS: JWT auth (FR1–FR2), RBAC (FR3),
event/community/post CRUD (FR4), and the custom exception set from **Appendix E**.

> **Not yet compiled in this environment.** This sandbox can reach npm/PyPI but not
> Maven Central, so this code was written and reviewed carefully but not build-verified
> here. Run `mvn clean install` locally as your first step — if anything doesn't compile,
> it's almost certainly a small dependency-version mismatch, easy to fix.

## Run locally

Requires Java 17+ and Maven.

```bash
mvn spring-boot:run
```

Starts on `http://localhost:8080`, backed by an in-memory H2 database (no setup needed).
Browse the DB at `http://localhost:8080/h2-console` (JDBC URL `jdbc:h2:mem:cned`, user `sa`,
blank password).

## Endpoints (Appendix H)

| Method | Path | Auth |
|---|---|---|
| POST | `/api/auth/register` | Public |
| POST | `/api/auth/login` | Public |
| POST | `/api/auth/logout` | Bearer token |
| GET | `/api/users/profile` | Bearer token |
| POST | `/api/members/register` | Public |
| GET | `/api/members/{id}` | Bearer token |
| POST | `/api/communities` | Bearer token |
| GET | `/api/communities/discover` | Public |
| PUT | `/api/communities/{id}/join` | Bearer token |
| POST | `/api/events` | Organiser / Manager / Admin |
| GET | `/api/events/discover` | Public |
| PUT | `/api/events/{id}/rsvp` | Bearer token |
| GET | `/api/events/{id}/analytics` | Bearer token |
| POST | `/api/posts` | Bearer token |
| GET | `/api/feed` | Bearer token |
| PUT | `/api/posts/{id}/like` | Bearer token |
| POST | `/api/posts/{id}/report` | Bearer token |

Bearer tokens go in `Authorization: Bearer <token>`, returned from `/api/auth/login`
and `/api/auth/register`.

## Deploying this backend

**Vercel does not run long-lived Java/Spring Boot servers** — it's built for static
sites and short-lived serverless functions, which is why the frontend (separate project)
goes there. For this backend, use a host built for containers/JVM processes instead:

- **Railway** or **Render** — easiest; point at this repo, they detect the `pom.xml` and
  build/run it. Set the environment variables below in their dashboard.
- **Fly.io** — `fly launch` with a generated Dockerfile (`fly launch` can scaffold one for
  a Maven project).
- **AWS/Azure/GCP** — containerize with Docker and deploy to ECS/App Service/Cloud Run,
  per the SRS's own deployment guidance (2.4 Operating Environment).

### Required environment variables in production

```
JWT_SECRET=<a long random string, 32+ characters>
DB_URL=jdbc:postgresql://<host>:5432/<db>
DB_DRIVER=org.postgresql.Driver
DB_USERNAME=<user>
DB_PASSWORD=<password>
DB_DIALECT=org.hibernate.dialect.PostgreSQLDialect
CORS_ALLOWED_ORIGINS=https://your-frontend.vercel.app
```

Without these, it falls back to an in-memory H2 database and a development-only JWT
secret — fine for local testing, **not** for production (data resets on every restart,
and the secret is public in this repo).

## Connecting the frontend

The React frontend currently runs entirely on mock data + `localStorage`, so it deploys
standalone with zero configuration. To wire it up to this real backend:

1. Deploy this backend and note its URL.
2. In the frontend project, replace the mock calls in `src/context/AuthContext.jsx`
   (`login`, `registerAccount`) with `fetch` calls to `/api/auth/login` and
   `/api/auth/register`, storing the returned JWT instead of a fake user object.
3. Replace the static arrays in `src/data/mockData.js` with `fetch` calls to
   `/api/events/discover`, `/api/communities/discover`, and `/api/feed`.
4. Add `VITE_API_BASE_URL` as a Vercel environment variable pointing at the backend URL.

This isn't wired up yet — it's a deliberate scope boundary so the frontend keeps working
as a zero-config Vercel deploy today.

## MySQL

MySQL is the default target database for production. See `src/main/resources/application-mysql.yml`.

```bash
# 1. create the database
mysql -u root -p -e "CREATE DATABASE cned CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

# 2. run against it
mvn spring-boot:run -Dspring-boot.run.profiles=mysql
```

Override credentials via `DB_USERNAME` / `DB_PASSWORD` / `DB_URL` environment variables instead
of editing the file directly.

## Postman

Import `postman_collection.json` into Postman. Set the `baseUrl` and `token` collection
variables (get `token` from the Login request's response) and every endpoint is ready to run.

## Added in this pass (SRS gap audit)

Cross-checked against the full FR1–FR17 SRS. Four concrete gaps were fixed:

- **`PUT /api/users/profile`** — profile editing was explicitly missing before (FR1). Name/phone only, changes logged.
- **`/api/admin/**`** (new `AdminController` + `AdminService`) — `SecurityConfig` already restricted this path to `ROLE_ADMIN`, but no controller existed behind it. Now provides `GET /users`, `PUT /users/{id}/status`, `PUT /users/{id}/role`, `GET /stats` (FR16).
- **`POST /api/events/bulk-import`** — CSV bulk import with per-row validation and error reporting, exactly as specified in FR4.
- **Security fix**: `User.passwordHash` is now `@JsonIgnore`'d at the entity level, since the new admin `GET /users` endpoint returns raw `User` entities and would otherwise have leaked password hashes in the response.

**Not built** — each of these is a separate subsystem, not a gap that fits in a single pass:
FR5 (workflow/approval engine), FR7 (document management), FR8 (notification delivery
infrastructure), FR10 (external integrations), FR13 (ML-based analytics), FR11 (native mobile
app), and the OTP/2FA/SSO extras under FR1–FR2.
