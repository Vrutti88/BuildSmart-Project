#!/bin/bash

DATE=$(date +%Y-%m-%d)

mysqldump \
-u admin \
-pbuildsmart123 \
buildsmart \
> backup_$DATE.sql

echo "Backup Created"