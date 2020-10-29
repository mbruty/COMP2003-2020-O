#!/bin/bash
set -e
docker exec -it devsite git fetch
docker exec -it devsite git pull origin Development
docker exec -it devsite npm run build
exit 