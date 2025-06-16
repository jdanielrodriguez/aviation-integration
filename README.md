# Aviation Integration Service

RESTful API developed in **Node.js + TypeScript** for integration with [AviationStack](https://aviationstack.com/) and for querying flight and airline information.  
Includes a complete environment with **Docker Compose**, automated tests, and fallback in case of external failures.

---

## Badges

![CI](https://github.com/jdanielrodriguez/aviation-integration/actions/workflows/test.yml/badge.svg)  
*Build and test automation via GitHub Actions*

---

## Included Services (Docker Compose)

- **Node.js** (Express, TypeScript)
- **MySQL 8**
- **Redis**
- **phpMyAdmin**
- **Mailhog** (email testing)

---

## Quick Start

1. Make sure you have Docker and Docker Compose installed.
2. Copy the `.env.example` file to `.env` and adjust variables if necessary.
3. To build the images and create the volumes, run

```bash
make init
```

4. To start all services use:

```bash
make start
```

5. To stop them use:

```bash
make stop-dev
```

---

## 🌐 Production Demo

You can try the API deployed on Cloud Run here:

👉 [https://aviation-integration-944235041157.us-central1.run.app/](https://aviation-integration-944235041157.us-central1.run.app/)

- Healthcheck: [/api/health](https://aviation-integration-944235041157.us-central1.run.app/api/health)
- Swagger UI: [/docs](https://aviation-integration-944235041157.us-central1.run.app/docs)
- Flights example: [/api/v1/flights?dep_iata=GUA](https://aviation-integration-944235041157.us-central1.run.app/api/v1/flights?dep_iata=GUA)
- Airports example: [/api/v1/airports?search=guatemala](https://aviation-integration-944235041157.us-central1.run.app/api/v1/airports?search=guatemala)
- Airlines example: [/api/v1/airlines?search=VX](https://aviation-integration-944235041157.us-central1.run.app/api/v1/airlines?search=VX)

---

## Quick Commands

```bash
make init # Initialize network, volumes, and services
make start # Start all development services
make stop-dev # Stop all development services
make node-shell # Enter Node.js terminal
make db-shell # Enter MySQL terminal
make redis-shell # Enter Redis terminal
make mailhog # Open Mailhog in the browser
make phpmyadmin # Open phpMyAdmin in the browser
make test # Run tests inside the Node.js container
```

---

## Environment Variables

See `.env.example` for the necessary configuration.  
**Glossary:**

| Variable           | Description                                |
| ------------------ | ------------------------------------------ |
| NODE_ENV           | Environment (development, production, etc) |
| PORT               | API port (default: 8080)                   |
| AVIATIONSTACK_KEY  | AviationStack API Key                      |
| AVIATIONSTACK_URL  | AviationStack API URL                      |
| MYSQL\_\*          | MySQL configuration                        |
| REDIS\_\*          | Redis configuration                        |
| MAIL*\* / GMAIL*\* | SMTP/Mailhog/Gmail for testing             |

---

## API Documentation

- Swagger UI: [https://aviation-integration-944235041157.us-central1.run.app/docs](https://aviation-integration-944235041157.us-central1.run.app/docs)
- [docs/API.md](docs/API.md) — English version with endpoints summary, parameters and examples
- Main endpoints:

| Method | Path             | Description                         |
| ------ | ---------------- | ----------------------------------- |
| GET    | /api/v1/airlines | List of airlines with local search  |
| GET    | /api/v1/airports | List of airports with local search  |
| GET    | /api/v1/flights  | Flight search with multiple filters |
| GET    | /api/health      | Check the status of all services    |

---

## Parameter Validation

All query parameters are validated with **Joi**, and validation errors return HTTP 422.  
See `src/utils/airportValidator.ts`, `src/utils/flightsValidator.ts` y `src/utils/airlineValidator.ts`.

---

## Fallback and Caching

- If the external API fails, the system first checks Redis, then MySQL.
- All successful external responses are automatically persisted.
- A TTL is applied to Redis cache.

---

## Automated Testing

Full support for:

- ✔️ **Unit tests** for controllers, services, validators, and middleware
- ✔️ **Integration tests** for REST endpoints
- ✔️ Data mocking for `NODE_ENV=test` to avoid real calls to AviationStack

To run:

```bash
make init
make test
```

---

## Architecture and Diagrams

- Data flow diagram:  
  [docs/data-flow.puml](docs/data-flow.puml)
- Architecture diagram:  
  [docs/architecture.puml](docs/architecture.puml)

---

## Quick Troubleshooting

- MySQL won't start? Delete the Docker volume:
  ```bash
  docker volume rm aviation_db_data
  ```
- API not responding on port? Check your `.env` and exposed ports.

---

## CI/CD and Deploy

- **Automatic deploy:**  
  When merging `develop` → `master`, it deploys to Cloud Run via GitHub Actions and the `GCP_SA_KEY` secret.
- **Manual deploy:**
  If you need to deploy manually:
  1. Obtain a service account key in JSON format with `Cloud Run Admin`, `Storage Admin`, and `Cloud Build` permissions.
  2. Authenticate with:
     ```bash
     gcloud auth activate-service-account --key-file gcp-key.json
     ```
  3. Launch the deploy:
     ```bash
     make deploy
     ```

---

## Linter and Dependencies

- Run before every PR

```bash
npm run lint
npm run format
```

- Audit dependencies regularly with

```bash
npm audit
```

---

## Contributing

Please review the [CONTRIBUTING.md](docs/CONTRIBUTING.md) before submitting a pull request.

---

## License

MIT  
Author: [@jdanielrodriguez](https://github.com/jdanielrodriguez)
