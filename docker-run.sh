#!/usr/bin/env sh
. ./prod.env.sh
echo Mongo host $MONGO_HOST
docker run \
  --network mongo-net \
  -e "NODE_ENV=production" -e "MONGO_HOST=$MONGO_HOST" -e "MONGO_USER=$MONGO_USER" -e "MONGO_PASS=$MONGO_PASS"\
  -u "node" \
  -m "300M" --memory-swap "1G" \
  -w "/home/node/app" \
  --name "application-service" \
  --init \
  -p 3000:3000 \
  -d \
  sonkal/application-service \
  node dist/index.js
