# Aviation Integration Service

API RESTful desarrollada en **Node.js + TypeScript** para integración con [AviationStack](https://aviationstack.com/) y consulta de información de vuelos y aerolíneas.
Incluye entorno completo con **Docker Compose** y pruebas automáticas.

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
3. Ejecuta `make init` para construir las imágenes y crear los volúmenes.
4. Usa `make dev` para levantar todos los servicios, o `make stop-dev` para detenerlos.

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

| Variable             | Descripción                            |
|----------------------|----------------------------------------|
| NODE_ENV             | Entorno (development, production, etc) |
| PORT                 | Puerto de la API (default: 8080)       |
| AVIATIONSTACK_KEY    | API Key de AviationStack               |
| MYSQL_*              | Configuración MySQL                    |
| REDIS_*              | Configuración Redis                    |
| MAIL_* / GMAIL_*     | SMTP/Mailhog/Gmail para testing        |

---

## Documentación de la API

- Swagger UI: [http://localhost:8080/docs](http://localhost:8080/docs)
- [docs/API.md](docs/API.md) — Resumen de endpoints, ejemplos y errores

---

## Pruebas

```bash
make test
```

---

## Arquitectura y diagramas

- Data flow: [docs/data-flow.puml](docs/data-flow.puml)

---

## Troubleshooting rápido

- ¿MySQL no levanta? Borra el volumen docker:  
  ```bash
  docker volume rm aviation_db_data
  ```
- ¿La API no responde en el puerto? Verifica tu `.env` y puertos expuestos.

---

## CI/CD y Deploy

- **Deploy automático:** Al hacer merge de un Pull Request de `develop` a `master`, se ejecuta el pipeline de despliegue a Cloud Run mediante GitHub Actions usando el secreto `GCP_SA_KEY`.
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

- Corre `npm run lint` y/o `npm run format` antes de cada PR.
- Audita dependencias con `npm audit` regularmente.

---

## Contribuir

Por favor revisa las [CONTRIBUTING.md](docs/CONTRIBUTING.md) antes de enviar un pull request.

---

## Licencia

MIT  
Autor: [@jdanielrodriguez](https://github.com/jdanielrodriguez)
