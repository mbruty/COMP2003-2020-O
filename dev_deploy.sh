#!/bin/bash
set -e
ssh ubuntu@51.195.201.170 -v
docker exec -it devsite git pull origin Development
docker exec -it devsite npm run build
exit 