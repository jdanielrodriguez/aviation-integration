# Aviation Integration Service

API REST en Node.js (TypeScript) para integración con AviationStack y gestión de vuelos/aerolíneas.

## Servicios incluidos (Docker Compose)
- Node.js (Express + TypeScript)
- MySQL 8
- Redis
- phpMyAdmin
- Mailhog

## Puesta en marcha

1. Asegúrate de tener Docker y Docker Compose instalados.
2. Copia el archivo `.env.example` como `.env` y ajusta las variables si es necesario.
3. Ejecuta `make init` para construir las imágenes y crear los volúmenes.
4. Finalmente usa `make start` para levantar todos los servicios o `make stop` para detenerlos.

## Comandos rápidos

```bash
make init         # Inicializa red, volúmenes y servicios
make start        # Levanta todos los servicios
make stop         # Detiene todos los servicios
make node-shell   # Entra a la terminal de Node.js
make db-shell     # Entra a la terminal de MySQL
make redis-shell  # Entra a la terminal de Redis
make rabbit-shell # Entra a la terminal de RabbitMQ
make mailhog      # Abre Mailhog en el navegador
make phpmyadmin   # Abre phpMyAdmin en el navegador
