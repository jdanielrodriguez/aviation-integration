# API Documentation

This API exposes REST services for querying **airports and flights**, integrated with [AviationStack](https://aviationstack.com/).  
Results are stored locally and are accessible even if the external provider fails.

---

### Production Demo

Base URL:

```text
https://aviation-integration-944235041157.us-central1.run.app/
```

- Swagger UI: [`/docs`](https://aviation-integration-944235041157.us-central1.run.app/docs)
- Flights example: [`/api/v1/flights?dep_iata=GUA`](https://aviation-integration-944235041157.us-central1.run.app/api/v1/flights?dep_iata=GUA)
- Airports example: [`/api/v1/airports?search=guatemala`](https://aviation-integration-944235041157.us-central1.run.app/api/v1/airports?search=guatemala)

---

## Main Endpoints

### 🩺 Healthcheck

- **GET** `/api/health`
- **Description:** Checks the availability of MySQL, Redis, and Mailer.
- **Successful response:**

```json
{
  "status": "ok",
  "timestamp": "2025-06-14T10:20:00.000Z",
  "uptime": 1200,
  "node_version": "v20.0.0",
  "services": {
    "mysql": "ok",
    "redis": "ok",
    "mailer": "ok"
  }
}
```

- **Possible errors:**
  - `500` → One or more services are down.

---

### ✈️ Airports

- **GET** `/api/v1/airports`
- **Description:** List of airports (stored locally after the first call).
- **Parameters:**

  - `search` (string, optional): Text to search by name, city, or country.
  - `limit` (int, optional): Maximum number of results to return (default 20).
  - `offset` (int, optional): Offset for pagination.

- **Usage example:**  
  `/api/v1/airports?search=guatemala&limit=10&offset=0`

- **Successful response:**

```json
{
  "pagination": {
    "limit": 10,
    "offset": 0,
    "count": 1,
    "total": 1
  },
  "data": [
    {
      "id": 1,
      "airport_name": "La Aurora International Airport",
      "iata_code": "GUA",
      "icao_code": "MGGT",
      "latitude": "14.5833",
      "longitude": "-90.5275",
      "timezone": "America/Guatemala",
      "gmt": "-6",
      "country_name": "Guatemala",
      "country_iso2": "GT",
      "city_iata_code": "GUA"
    }
  ]
}
```

---

### 🛫 Flights

- **GET** `/api/v1/flights`
- **Description:** List of flights with multiple filters. Data is synchronized with AviationStack at least once per day.

- **Available search parameters (all optional):**

  - `dep_iata`: Departure airport IATA code
  - `arr_iata`: Arrival airport IATA code
  - `flight_number`: Flight number
  - `flight_date`: Flight date (`YYYY-MM-DD`)
  - `flight_status`: `scheduled` | `active` | `landed` | `cancelled` | `incident` | `diverted`
  - `limit`: number of results (max: 1000)
  - `offset`: offset for pagination

- **Example:**  
  `/api/v1/flights?dep_iata=GUA&flight_status=scheduled&limit=20`

- **Response:**

```json
{
  "pagination": {
    "limit": 20,
    "offset": 0,
    "count": 1,
    "total": 1
  },
  "data": [
    {
      "id": 1,
      "flight_date": "2025-06-15",
      "flight_status": "scheduled",
      "departure": {
        "iata": "GUA",
        "airport": "La Aurora International Airport"
        // ...
      },
      "arrival": {
        "iata": "MEX",
        "airport": "Mexico City Intl"
        // ...
      },
      "airline": {
        "iata": "AM",
        "name": "Aeromexico"
      },
      "flight": {
        "number": "123",
        "iata": "AM123",
        "icao": "AMX123"
      }
    }
  ]
}
```

---

## 🧪 Validations and Errors

### Common errors

| Code | Meaning               | Likely cause                              |
| ---- | --------------------- | ----------------------------------------- |
| 422  | Unprocessable Entity  | One or more parameters are invalid        |
| 429  | Too Many Requests     | Call limit reached                        |
| 500  | Internal Server Error | Unexpected error or external service down |

- **422 Example:**

```json
{
  "error": {
    "status": 422,
    "message": "Validation error",
    "errors": [
      {
        "msg": "\"dep_iata\" length must be at least 3 characters long",
        "path": "dep_iata"
      }
    ]
  }
}
```

---

## 🧭 Swagger UI

You can explore and test the API at:

[http://localhost:8080/docs](http://localhost:8080/docs)

---

## 🧰 Extras

- All data is cached in Redis for 90 seconds to avoid overuse of the provider.
- If the external API is down, data can be served from the local database (fallback).
- Each query is logged in the `api_calls` table.

---
