#!/bin/bash

DATE=$(date +%Y-%m-%d)

BACKUP_FILE="backup_$DATE.sql"

mysqldump \
-u admin \
-pbuildsmart123 \
buildsmart \
> $BACKUP_FILE

echo "Backup Created"

aws s3 cp $BACKUP_FILE s3://buildsmart-db-backups/

echo "Backup Uploaded to S3"

rm $BACKUP_FILE

echo "Local Backup Removed"