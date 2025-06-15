# Documentación de la API

Esta API expone servicios REST para la consulta de **aeropuertos y vuelos**, con integración a [AviationStack](https://aviationstack.com/).  
Los resultados se almacenan localmente y son accesibles incluso ante fallos del proveedor externo.

---

### Demo en producción

Base URL:  
```text
https://aviation-integration-944235041157.us-central1.run.app/
```

- Swagger UI: [`/docs`](https://aviation-integration-944235041157.us-central1.run.app/docs)
- Ejemplo vuelos: [`/api/v1/flights?dep_iata=GUA`](https://aviation-integration-944235041157.us-central1.run.app/api/v1/flights?dep_iata=GUA)
- Ejemplo aeropuertos: [`/api/v1/airports?search=guatemala`](https://aviation-integration-944235041157.us-central1.run.app/api/v1/airports?search=guatemala)

---

## Endpoints Principales

### 🩺 Healthcheck

- **GET** `/api/health`
- **Descripción:** Verifica la disponibilidad de MySQL, Redis y Mailer.
- **Respuesta exitosa:**

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

- **Posibles errores:**
  - `500` → Uno o más servicios están caídos.

---

### ✈️ Aeropuertos

- **GET** `/api/v1/airports`
- **Descripción:** Lista de aeropuertos (almacenada localmente tras la primera llamada).
- **Parámetros:**

  - `search` (string, opcional): Texto para buscar por nombre, ciudad o país.
  - `limit` (int, opcional): Máximo de resultados a retornar (por defecto 20).
  - `offset` (int, opcional): Desplazamiento para paginación.

- **Ejemplo de uso:**  
  `/api/v1/airports?search=guatemala&limit=10&offset=0`

- **Respuesta exitosa:**

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

### 🛫 Vuelos

- **GET** `/api/v1/flights`
- **Descripción:** Lista de vuelos con filtros múltiples. Los datos se sincronizan con AviationStack al menos una vez por día.

- **Parámetros de búsqueda disponibles (todos opcionales):**

  - `dep_iata`: Código IATA de aeropuerto de salida
  - `arr_iata`: Código IATA de aeropuerto de llegada
  - `flight_number`: Número de vuelo
  - `flight_date`: Fecha del vuelo (`YYYY-MM-DD`)
  - `flight_status`: `scheduled` | `active` | `landed` | `cancelled` | `incident` | `diverted`
  - `limit`: cantidad de resultados (máx: 1000)
  - `offset`: desplazamiento para paginación

- **Ejemplo:**  
  `/api/v1/flights?dep_iata=GUA&flight_status=scheduled&limit=20`

- **Respuesta:**

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

## 🧪 Validaciones y Errores

### Errores comunes

| Código | Significado           | Causa probable                            |
| ------ | --------------------- | ----------------------------------------- |
| 422    | Unprocessable Entity  | Algún parámetro es inválido               |
| 429    | Too Many Requests     | Se alcanzó el límite de llamadas          |
| 500    | Internal Server Error | Error inesperado o servicio externo caído |

- **Ejemplo 422:**

```json
{
  "error": {
    "status": 422,
    "message": "Error de validación",
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

Puedes explorar y probar la API desde:

[http://localhost:8080/docs](http://localhost:8080/docs)

---

## 🧰 Extras

- Todos los datos se cachean en Redis por 90 segundos para evitar overuse del proveedor.
- En caso de caída del API externa, la información puede responder desde la base de datos local (fallback).
- Cada consulta se registra en la tabla `api_calls`.

---
