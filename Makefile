.PHONY: dev
dev:
	@echo "Levantando entorno de desarrollo..."
	docker compose -f docker-compose.yml up --build

.PHONY: stop-dev
stop-dev:
	@echo "Deteniendo entorno de desarrollo..."
	docker compose -f docker-compose.yml stop

.PHONY: network-create
network-create:
	@echo "Creando red aviation_network con subnet personalizada..."
	docker network create --gateway 172.18.0.1 --subnet 172.18.0.0/24 aviation_network || true

.PHONY: network-remove
network-remove:
	@echo "Eliminando red aviation_network..."
	docker network rm aviation_network || true

.PHONY: init
init: network-create
	@echo "Inicializando entorno (red, volúmenes y servicios para desarrollo)..."
	docker volume inspect aviation_db_data >/dev/null 2>&1 || docker volume create aviation_db_data
	docker volume inspect aviation_redis_data >/dev/null 2>&1 || docker volume create aviation_redis_data
	docker compose -f docker-compose.yml build
	docker compose -f docker-compose.yml up -d

.PHONY: rebuild-dev
rebuild-dev:
	@echo "Reconstruyendo servicios de desarrollo..."
	docker compose -f docker-compose.yml up --build --force-recreate -d

.PHONY: node-shell
node-shell:
	docker exec -it aviation_node /bin/sh

.PHONY: db-shell
db-shell:
	docker exec -it aviation_db /bin/bash

.PHONY: redis-shell
redis-shell:
	docker exec -it aviation_redis /bin/sh

.PHONY: rabbit-shell
rabbit-shell:
	docker exec -it aviation_rabbit /bin/bash

.PHONY: mailhog
mailhog:
	@echo "Accede a Mailhog en http://localhost:8025"

.PHONY: phpmyadmin
phpmyadmin:
	@echo "Accede a phpMyAdmin en http://localhost:8081"

.PHONY: test
test:
	@echo "Corriendo pruebas dentro del contenedor aviation_node..."
	docker exec -e NODE_ENV=test aviation_node npm test

