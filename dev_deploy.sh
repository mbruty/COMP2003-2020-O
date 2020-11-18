#!/bin/bash
set -e
docker exec devsite git fetch
docker exec devsite git pull origin Development
docker exec devsite npm run build
exit 