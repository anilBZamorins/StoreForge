#!/usr/bin/env bash
# Nightly MySQL backup — add to root crontab: 0 3 * * * bash /var/www/storeforge/deploy/scripts/backup-db.sh
set -euo pipefail
BACKUP_DIR=/var/backups/storeforge
mkdir -p $BACKUP_DIR
STAMP=$(date +%F)
mysqldump --single-transaction --routines --all-databases | gzip > "$BACKUP_DIR/storeforge-$STAMP.sql.gz"
find $BACKUP_DIR -name "*.sql.gz" -mtime +14 -delete
# Recommended: also push to DigitalOcean Spaces with s3cmd/rclone for off-droplet copies.
