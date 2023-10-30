#!/bin/bash

source ./backup_config.txt

datestamp=$(date +%Y-%m-%d_%H-%M-%S)
echo $datestamp

echo "Backing up kiosk media..."
if lftp -u "$FTP_USER","$FTP_PASS" -e "mirror -Re $MEDIA_DIR kiosk_media/; quit" ftp://"$FTP_SERVER" ; then
    echo "done."
else
    echo "backup failed."
fi

mkdir -p $LOCAL_BACKUP_DIR

echo "Creating local database backup..."
if cp /home/pi/fablabedp-kiosk/kiosk_app/database.json "$LOCAL_BACKUP_DIR"database_$datestamp.json ; then
    echo "done."
else
    echo "backup failed."
fi

echo "Deleting backups older than 1 week"
if find  $LOCAL_BACKUP_DIR -type f -mtime +7 -delete ; then
    echo "done."
else
    echo "delete failed."
fi

echo "Backing up database backups..."
if lftp -u "$FTP_USER","$FTP_PASS" -e "mirror -Re $LOCAL_BACKUP_DIR database/; quit" ftp://"$FTP_SERVER" ; then
    echo "done."
else
    echo "backup failed."
fi