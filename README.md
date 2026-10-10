# TaskForge AI

TaskForge AI is a backend-focused project exploring how to build a maintainable, scalable, multi-tenant project and task management platform.

The project is being developed incrementally, with an emphasis on backend engineering, clean code organization, database design, and production-oriented development practices.

## Current Features

- Express.js HTTP server
- Health-check API endpoint
- PostgreSQL database connectivity using the `pg` package
- Environment-based configuration using `.env`
- Feature-oriented controller and use-case organization
- Initial Clean Architecture principles

## Technology Stack

- **Runtime:** Node.js
- **Language:** JavaScript (CommonJS)
- **HTTP framework:** Express.js
- **Database:** PostgreSQL
- **Database driver:** node-postgres (`pg`)
- **Configuration:** dotenv
- **Version control:** Git

## Project Structure

```text
TaskForge AI/
├── src/
│   ├── server.js
│   ├── routes.js
│   ├── controllers/
│   │   └── health-check/
│   ├── usecases/
│   │   └── health-check/
│   └── infrastructure/
│       └── database/
│           └── postgres.js
├── database/
│   └── migrations/
├── tests/
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

The structure will evolve as additional features and infrastructure components are implemented.

## Prerequisites

- Node.js and npm
- PostgreSQL
- Git

## Getting Started

### 1. Clone the repository

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
cd "TaskForge AI"
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the project root.

Configure the required variables using your local PostgreSQL credentials:

```dotenv
PORT=3000

DB_HOST=localhost
DB_PORT=5432
DB_NAME=taskforge
DB_USER=postgres
DB_PASSWORD=your_local_password
```

Replace the example password with your own local PostgreSQL password. Never commit your real `.env` file.

### 4. Start the server

```bash
npm start
```

The server performs a PostgreSQL connectivity check during startup. If the initial database connection fails, the server does not start successfully.

## API Endpoints

### Health Check

**Endpoint:** `GET /health`

**Purpose:** Checks that the health-check endpoint is reachable.

Example request:

```http
GET http://localhost:3000/health
```

Example response:

```json
{
  "status": "Ok"
}
```

The current health-check endpoint returns application status. It is not a continuous database-health monitor.

## Development Approach

The project is being developed incrementally with an emphasis on:

- Separation of controllers, use cases, and infrastructure
- Dependency injection where appropriate
- Explicit database access and schema management
- Environment-based configuration
- Version-controlled changes
- Testing and validation as features are added

## Planned Features

The following are planned, not yet implemented:

- Database migration workflow
- Tenant registration and management
- User authentication and authorization
- Organization and project management
- Task management and comments
- Redis caching
- Event-driven processing with Kafka
- AI-powered features
- Containerization and deployment

## Project Status

**Current milestone:** Express server, health-check endpoint, and PostgreSQL startup connectivity check.

The project is under active development. Features and architecture will evolve as new milestones are completed.

## Security

- Keep `.env` out of version control.
- Never commit passwords, tokens, or private keys.
- Use environment variables for local configuration.
- Use managed secrets and appropriately restricted database credentials in deployed environments.