#!/bin/bash
# deploy.sh

docker compose -f docker-compose.deploy.yml down
docker compose -f docker-compose.deploy.yml pull
docker compose -f docker-compose.deploy.yml up >~/wildcode/front/logs/log.compose.$(date +"%s") 2>&1 &
disown
