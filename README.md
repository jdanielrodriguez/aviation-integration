# Aviation Integration Service

API RESTful desarrollada en **Node.js + TypeScript** para integración con [AviationStack](https://aviationstack.com/) y consulta de información de vuelos y aerolíneas.  
Incluye entorno completo con **Docker Compose**, pruebas automáticas y fallback ante fallos externos.

---

## Badges

![CI](https://github.com/jdanielrodriguez/aviation-integration/actions/workflows/test.yml/badge.svg)  
*Build y test automáticos vía GitHub Actions*

---

## Servicios incluidos (Docker Compose)

- **Node.js** (Express, TypeScript)
- **MySQL 8**
- **Redis**
- **phpMyAdmin**
- **Mailhog** (testing de emails)

---

## Puesta en marcha rápida

1. Asegúrate de tener Docker y Docker Compose instalados.
2. Copia el archivo `.env.example` como `.env` y ajusta las variables si es necesario.
3. Para construir las imágenes y crear los volúmenes ejecuta

```bash
make init
```

4. para levantar todos los servicios usa :

```bash
make start
```

5. para detenerlos usa:

```bash
make stop-dev
```

---

## 🌐 Demo en producción

Puedes probar la API desplegada en Cloud Run aquí:

👉 [https://aviation-integration-944235041157.us-central1.run.app/](https://aviation-integration-944235041157.us-central1.run.app/)

- Healthcheck: [/api/health](https://aviation-integration-944235041157.us-central1.run.app/api/health)
- Swagger UI: [/docs](https://aviation-integration-944235041157.us-central1.run.app/docs)
- Ejemplo vuelos: [/api/v1/flights?dep_iata=GUA](https://aviation-integration-944235041157.us-central1.run.app/api/v1/flights?dep_iata=GUA)
- Ejemplo aeropuertos: [/api/v1/airports?search=guatemala](https://aviation-integration-944235041157.us-central1.run.app/api/v1/airports?search=guatemala)

---


## Comandos rápidos

```bash
make init         # Inicializa red, volúmenes y servicios
make start        # Levanta todos los servicios en desarrollo
make stop-dev     # Detiene todos los servicios en desarrollo
make node-shell   # Entra a la terminal de Node.js
make db-shell     # Entra a la terminal de MySQL
make redis-shell  # Entra a la terminal de Redis
make mailhog      # Abre Mailhog en el navegador
make phpmyadmin   # Abre phpMyAdmin en el navegador
make test         # Corre las pruebas dentro del contenedor Node.js
```

---

## Variables de entorno

Consulta `.env.example` para la configuración necesaria.  
**Glosario:**

| Variable           | Descripción                            |
| ------------------ | -------------------------------------- |
| NODE_ENV           | Entorno (development, production, etc) |
| PORT               | Puerto de la API (default: 8080)       |
| AVIATIONSTACK_KEY  | API Key de AviationStack               |
| AVIATIONSTACK_URL  | API URL de AviationStack               |
| MYSQL\_\*          | Configuración MySQL                    |
| REDIS\_\*          | Configuración Redis                    |
| MAIL*\* / GMAIL*\* | SMTP/Mailhog/Gmail para testing        |

---

## Documentación de la API

- Swagger UI: [http://localhost:8080/docs](http://localhost:8080/docs)
- [docs/API.md](docs/API.md) — Resumen de endpoints, parámetros y ejemplos
- Endpoints principales:

| Método | Ruta             | Descripción                              |
| ------ | ---------------- | ---------------------------------------- |
| GET    | /api/v1/airports | Lista de aeropuertos con search local    |
| GET    | /api/v1/flights  | Búsqueda de vuelos con múltiples filtros |
| GET    | /api/health      | Verificar estado de los servicios        |

---

## Validación de parámetros

Todos los parámetros de consulta son validados con **Joi**, y errores de validación devuelven HTTP 422.  
Ver en `src/utils/airportValidator.ts` y `src/utils/flightsValidator.ts`.

---

## Fallback y caching

- Si la API externa falla, el sistema busca primero en Redis, luego en MySQL.
- Todas las respuestas externas exitosas se persisten automáticamente.
- Se aplica TTL sobre el cache en Redis.

---

## Pruebas automáticas

Soporte completo para:

- ✔️ Pruebas **unitarias** de controladores, servicios, validadores y middleware
- ✔️ Pruebas **de integración** para endpoints REST
- ✔️ Mock de datos para entorno `NODE_ENV=test` evitando llamadas reales a AviationStack

Para correr:

```bash
make init
make test
```

---

## Arquitectura y diagramas

- Diagrama de flujo de datos:  
  [docs/data-flow.puml](data-flow.puml)

---

## Troubleshooting rápido

- ¿MySQL no levanta? Borra el volumen docker:
  ```bash
  docker volume rm aviation_db_data
  ```
- ¿La API no responde en el puerto? Verifica tu `.env` y puertos expuestos.

---

## CI/CD y Deploy

- **Deploy automático:**  
  Al hacer merge de `develop` → `master`, se despliega a Cloud Run mediante GitHub Actions y el secreto `GCP_SA_KEY`.
- **Deploy manual:**
  Si necesitas desplegar manualmente:
  1. Consigue una key de servicio en formato JSON con permisos de `Cloud Run Admin`, `Storage Admin` y `Cloud Build`.
  2. Autentica con:
     ```bash
     gcloud auth activate-service-account --key-file gcp-key.json
     ```
  3. Lanza el deploy:
     ```bash
     make deploy
     ```

---

## Linter y dependencias

- Corre antes de cada PR

```bash
npm run lint
npm run format
```

- Audita dependencias regularmente con

```bash
npm audit
```

---

## Contribuir

Por favor revisa las [CONTRIBUTING.md](docs/CONTRIBUTING.md) antes de enviar un pull request.

---

## Licencia

MIT
Autor: [@jdanielrodriguez](https://github.com/jdanielrodriguez)
