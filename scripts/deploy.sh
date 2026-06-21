#!/bin/bash

echo "Deploying BuildSmart..."

git pull origin main

docker compose down

docker compose build --no-cache

docker compose up -d

docker ps

echo "Deployment completed"