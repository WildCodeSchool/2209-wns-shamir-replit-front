#!/bin/bash
# deploy.sh

docker compose -f docker-compose.deploy.yml down
docker stop $(docker ps --filter name=front* -q)
docker rmi -f $(docker images gnos28/wildcode-front -q)
docker image prune -f
docker compose -f docker-compose.deploy.yml pull
docker compose -f docker-compose.deploy.yml up >~/wildcode/front/logs/log.compose.$(date +"%s") 2>&1 &
disown
