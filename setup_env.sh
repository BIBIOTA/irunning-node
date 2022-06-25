#!/bin/sh

echo PORT=80 >> .env
echo APP_NAME=irunning-node >> .env
echo TELEGRAM_TOKEN=$TELEGRAM_TOKEN >> .env
echo LARAVEL_API_URL=$LARAVEL_API_URL >> .env
echo NODE=production >> .env
echo MY_SLACK_WEBHOOK_URL=$MY_SLACK_WEBHOOK_URL >> .env