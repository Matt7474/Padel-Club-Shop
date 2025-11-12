#!/bin/bash

ARCHIVE_NAME="pcs-stack.tar.gz"
REMOTE_USER="root"
REMOTE_HOST="217.154.15.118"
REMOTE_DIR="/srv/pcs"   # <- changer ici

echo "🚀 Déploiement de $ARCHIVE_NAME vers $REMOTE_HOST..."

# créer le dossier distant si nécessaire
ssh -i ~/.ssh/id_rsa $REMOTE_USER@$REMOTE_HOST "mkdir -p $REMOTE_DIR"

# upload
scp -i ~/.ssh/id_rsa $ARCHIVE_NAME $REMOTE_USER@$REMOTE_HOST:$REMOTE_DIR/

# déployer
ssh -i ~/.ssh/id_rsa $REMOTE_USER@$REMOTE_HOST << EOF
  cd $REMOTE_DIR
  tar xzf $ARCHIVE_NAME
  docker system prune -a --volumes -f
  docker-compose down --volumes
  docker-compose build --no-cache
  rm -rf ./database/data/*
  docker-compose up -d
EOF


# #!/bin/bash

# ARCHIVE_NAME="pcs-stack.tar.gz"
# REMOTE_USER="root"
# REMOTE_HOST="217.154.15.118"
# REMOTE_DIR="/root/pcs-stack"

# scp -i ~/.ssh/id_rsa $ARCHIVE_NAME $REMOTE_USER@$REMOTE_HOST:$REMOTE_DIR/

# ssh -i ~/.ssh/id_rsa $REMOTE_USER@$REMOTE_HOST << EOF
#   cd $REMOTE_DIR
#   tar xzf $ARCHIVE_NAME
#   docker system prune -a --volumes -f
#   docker-compose down --volumes
#   docker-compose build --no-cache
#   docker-compose up -d
# EOF
