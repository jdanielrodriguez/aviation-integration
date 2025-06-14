# Documentación de la API

Esta API expone servicios REST para consulta de vuelos y aerolíneas, integrando AviationStack.

## Endpoints Principales

### Healthcheck

- **GET** `/api/health`
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

---

### Aerolíneas

- **GET** `/api/v1/airlines`
- **Parámetros:**
  - `search` (opcional): Búsqueda parcial por nombre o código IATA.
- **Ejemplo:** `/api/v1/airlines?search=AA`
- **Respuesta:**

```json
[
  {
    "iata_code": "AA",
    "name": "American Airlines"
    // ...otros campos
  }
]
```

---

### Vuelos

- **GET** `/api/v1/flights`
- **Parámetros:**
  - `dep_iata` (opcional): Código IATA aeropuerto origen (ej: GUA).
  - `arr_iata` (opcional): Código IATA aeropuerto destino (ej: MEX).
  - `flight_number` (opcional): Número de vuelo.
- **Ejemplo:** `/api/v1/flights?dep_iata=GUA&arr_iata=MEX`
- **Respuesta:**

```json
[
  {
    "flight_number": "123",
    "airline": "AA",
    "dep_iata": "GUA",
    "arr_iata": "MEX"
    // ...otros campos
  }
]
```

---

## Errores Comunes

- **422 Unprocessable Entity:** Parámetros inválidos.
- **500 Internal Server Error:** Fallo interno, ver logs.
- **429 Too Many Requests:** Límite de rate limit alcanzado.

---

## Swagger

La documentación interactiva está en:  
[http://localhost:8080/docs](http://localhost:8080/docs)
