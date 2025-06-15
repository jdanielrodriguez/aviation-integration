.PHONY: dev
dev:
	@echo "Setting up development environment..."
	docker compose -f docker-compose.yml up --build

.PHONY: stop-dev
stop-dev:
	@echo "Stopping development environment..."
	docker compose -f docker-compose.yml stop

.PHONY: network-create
network-create:
	@echo "Creating an aviation network with a custom subnet..."
	docker network create --gateway 172.18.0.1 --subnet 172.18.0.0/24 aviation_network || true

.PHONY: network-remove
network-remove:
	@echo "Removing aviation_network..."
	docker network rm aviation_network || true

.PHONY: init
init: network-create
	@echo "Initializing environment (network, volumes, and services for development)..."
	docker volume inspect aviation_db_data >/dev/null 2>&1 || docker volume create aviation_db_data
	docker volume inspect aviation_redis_data >/dev/null 2>&1 || docker volume create aviation_redis_data
	docker compose -f docker-compose.yml build
	docker compose -f docker-compose.yml up -d

.PHONY: init-test
init-test: network-create
	@echo "Initializing environment (network, volumes, and services for testing)..."
	docker volume inspect aviation_db_data >/dev/null 2>&1 || docker volume create aviation_db_data
	docker volume inspect aviation_redis_data >/dev/null 2>&1 || docker volume create aviation_redis_data
	docker compose -f docker-compose.yml -f docker-compose.test.yml build
	docker compose -f docker-compose.yml -f docker-compose.test.yml up -d

.PHONY: rebuild-dev
rebuild-dev:
	@echo "Rebuilding development services..."
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
	@echo "Access Mailhog at http://localhost:8025"

.PHONY: phpmyadmin
phpmyadmin:
	@echo "Access phpMyAdmin at http://localhost:8081"

.PHONY: test
test:
	@echo "Running tests inside the aviation_node container..."
	docker exec -e NODE_ENV=test aviation_node npm test

.PHONY: deploy
deploy:
	@echo "Authenticating and deploying to Google Cloud Run..."
	gcloud auth activate-service-account --key-file gcp-key.json
	gcloud config set project aviation-integration
	gcloud builds submit --tag gcr.io/aviation-integration/aviation-integration
	gcloud run deploy aviation-integration \
		--image gcr.io/aviation-integration/aviation-integration \
		--region us-central1 \
		--platform managed \
		--allow-unauthenticated

.PHONY: db-stop
db-stop:
	@echo "Authenticating service account and shutting down Cloud SQL instance..."
	gcloud auth activate-service-account --key-file=gcp-key.json
	gcloud config set project aviation-integration
	gcloud sql instances patch aviation-integration --activation-policy=NEVER

.PHONY: db-start
db-start:
	@echo "Authenticating service account and powering on Cloud SQL instance..."
	gcloud auth activate-service-account --key-file=gcp-key.json
	gcloud config set project aviation-integration
	gcloud sql instances patch aviation-integration --activation-policy=ALWAYS
