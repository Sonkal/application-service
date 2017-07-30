#!/usr/bin/env sh
docker run \
  --network mongo-net \
  -e "NODE_ENV=production" \
  -u "node" \
  -m "300M" --memory-swap "1G" \
  -w "/home/node/app" \
  --name "application-service" \
  --init \
  -it \
  sonkal/application-service \
#  sh
  node dist/index.js