#!/bin/bash
set -e  # Stop en cas d'erreur

ARCHIVE_NAME="pcs-stack.tar.gz"
REMOTE_USER="root"
REMOTE_HOST="217.154.15.118"
REMOTE_DIR="/root/pcs-stack"
SSH_KEY_PATH="$HOME/.ssh/id_rsa"

echo "🚀 Déploiement de $ARCHIVE_NAME vers $REMOTE_HOST..."

# Envoi de l’archive
scp -i $SSH_KEY_PATH -o StrictHostKeyChecking=no $ARCHIVE_NAME $REMOTE_USER@$REMOTE_HOST:$REMOTE_DIR/

# Connexion SSH + déploiement
ssh -i $SSH_KEY_PATH -o StrictHostKeyChecking=no $REMOTE_USER@$REMOTE_HOST << EOF
  set -e
  cd $REMOTE_DIR

  echo "📦 Extraction du code..."
  tar xzf $ARCHIVE_NAME

  echo "🧹 Nettoyage des anciens conteneurs..."
  docker-compose down --volumes || true

  echo "🧱 Reconstruction complète..."
  docker-compose build --no-cache

  echo "🟢 Lancement du stack..."
  docker-compose up -d

  echo "✅ Déploiement terminé."
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
