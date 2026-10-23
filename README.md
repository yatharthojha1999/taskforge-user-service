TaskForge AI --- User Service
The User Service manages tenant and user records for TaskForge AI. It is
a Node.js/Express service using PostgreSQL and Joi validation.
Current responsibilities
- Register a tenant and its initial user.
- Store tenant/user data in the taskforge_users database.
- Request credential creation from the Auth Service during
  registration.
- Provide an internal user lookup used by the Auth Service.
- Keep the initial user pending until credential creation succeeds, as
  implemented by the registration flow.
Technology
- Node.js
- Express
- PostgreSQL
- Joi
- Docker Compose
Run with Docker Compose
Run commands from the main taskforge-ai repository root.

Ensure the root .env contains POSTGRES_PASSWORD, and ensure the
PostgreSQL container has a database named taskforge_users. If it does
not exist, create it:
docker compose exec postgres psql -U taskforge -d postgres -c "CREATE DATABASE taskforge_users;"
Run the User Service migrations:
docker compose --profile migrations run --build --rm user-migrate
Start or rebuild the service:
docker compose up -d --build user-service
Check status and logs:
docker compose ps
docker compose logs --tail=80 user-service
The service is exposed at http://localhost:3000 on the host. Other
Compose services should reach it at http://user-service:3000.
Environment variables
  Variable             Docker Compose value / purpose
  PORT               3000
  DB_HOST            postgres
  DB_PORT            5432
  DB_NAME            taskforge_users
  DB_USER            taskforge
  DB_PASSWORD        Read from root .env as POSTGRES_PASSWORD
  AUTH_SERVICE_URL   http://auth-service:3001 in Docker

The application configuration should read process.env.AUTH_SERVICE_URL
and use http://localhost:3001 only as a fallback for local
development.
API routes
  Method                  Endpoint                                                 Purpose
  POST                  /v1/tenants/register                                   Register a tenant and
                                                                                   its initial user

  GET                   /internal/v1/tenants/:linkname/users/by-email/:email   Internal lookup by
                                                                                   tenant link name and
                                                                               email
The internal lookup is used by the Auth Service. Confirm required
fields, validation rules, status codes, and response formats in the
current route/controller/validator implementation before using these
endpoints.
Database
The service database is taskforge_users. After migrations, the
expected tables are:
- tenants
- users
- pgmigrations
Verify:
docker compose exec postgres psql -U taskforge -d taskforge_users -c "\dt"
Run migrations again after adding a new migration file:
docker compose --profile migrations run --build --rm user-migrate
Service-to-service registration flow
1. The registration request reaches the User Service.
2. The service creates the tenant/user records according to its
   registration logic.
3. It calls the Auth Service through AUTH_SERVICE_URL to create
   credentials.
4. The user is marked active only after credential creation succeeds;
   otherwise, the registration flow handles the failure and keeps the
   data consistent according to the implemented logic.
Inside Docker, do not hardcode localhost:3001 for Auth Service calls.
localhost inside a container refers to that same container.
Troubleshooting
docker compose logs --tail=100 user-service
docker compose exec user-service printenv AUTH_SERVICE_URL
Expected Docker URL:
http://auth-service:3001
If PostgreSQL reports that the database does not exist, create the
database and run the migration job. Do not remove the PostgreSQL volume
to resolve this issue.
Tests and documentation
Registration has been tested in the Dockerized environment. Keep this
status current as additional tests are performed. When adding endpoints
or migrations, update this README with the method, path,
request/response examples, configuration changes, and test results.