#!/bin/bash

echo "Starting maintenance..."

find /tmp -type f -mtime +7 -delete

docker image prune -f

docker container prune -f

docker system prune -f

find /var/log -name "*.log" -mtime +30 -delete 2>/dev/null

echo "Maintenance completed"