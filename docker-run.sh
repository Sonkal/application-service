#!/usr/bin/env sh
docker run \
  --network mongo-net \
  -e "NODE_ENV=production" -e "MONGO_HOST=mymongo"\
  -u "node" \
  -m "300M" --memory-swap "1G" \
  -w "/home/node/app" \
  --name "application-service" \
  --init \
  -p 3000:3000 \
  -d \
  sonkal/application-service \
  node dist/index.js
