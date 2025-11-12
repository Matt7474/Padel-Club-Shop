# PCS - Padel Club Shop 🎾

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18-brightgreen)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)

**PCS - Padel Club Shop** est une application e-commerce **"fictive"** full-stack moderne dédiée à la vente de matériel de padel. Développée avec **Node.js, React et TypeScript**, elle offre une expérience utilisateur fluide et un backoffice administratif complet.

---

## 📋 Table des matières

- [Stack Technique](#-stack-technique)
- [Fonctionnalités](#-fonctionnalités)
- [Architecture](#-architecture)
- [Installation](#️-installation)
- [Configuration](#-configuration)
- [Paiements Stripe](#-intégration-stripe)
- [Rôles et Permissions](#-rôles-et-permissions)
- [Mode Démo](#-mode-démo)
- [Licence](#-licence)
- [Contact](#-contact)

---

## 🌐 Stack Technique

### Frontend
- **Framework** : React 18 + TypeScript
- **Build Tool** : Vite
- **Styling** : TailwindCSS
- **State Management** : Zustand
- **HTTP Client** : Axios
- **Routing** : React Router v6

### Backend
- **Runtime** : Node.js (≥18)
- **Framework** : Express.js + TypeScript
- **Base de données** : PostgreSQL (≥14)
- **ORM** : Sequelize
- **Authentification** : JWT (JSON Web Tokens)
- **Validation** : Joi / Sanitize-html
- **Paiement** : Stripe API

### DevOps & Hébergement
- **Frontend** : o2switch
- **Backend + Base de données** : IONOS
- **Architecture** : Monorepo
- **CI/CD** : GitHub Actions

---

## 🧩 Fonctionnalités

### 🔐 Authentification & Gestion des Utilisateurs
- Inscription / Connexion sécurisée avec JWT
- Système de rôles avancé :
  - **Super Admin** : contrôle total de l'application
  - **Admin** : gestion produits, commandes et utilisateurs (sauf Super Admin)
  - **Testeur** : équivalent Admin mais ne peut pas modifier ses propres identifiants (email/mot de passe) pour éviter le blocage du compte partagé
  - **Client** : navigation, achat et suivi de commandes
- Gestion de profil
- Messagerie instantanée client ↔ admin
- Historique des commandes et téléchargement de factures PDF

### 🛍️ Gestion des Produits
- CRUD complet (Create, Read, Update, Delete)
- Upload d'images multi-formats
- Gestion des stocks en temps réel
- Système de promotions et prix spéciaux
- Catégorisation et filtres avancés
- Recherche intelligente

### 📦 Gestion des Commandes
- Panier dynamique avec sauvegarde automatique
- Processus de checkout fluide
- Calcul automatique des frais de livraison
- Suivi en temps réel des commandes
- Gestion des statuts : Payé, En préparation, Prête, Expédiée, Annulée, Remboursée
- Système de remboursement intégré

### 💳 Paiement Sécurisé
- Intégration complète **Stripe** (mode test)
- Support des cartes bancaires
- Webhooks pour validation des paiements
- Gestion des échecs de paiement
- Historique des transactions

### 📊 Dashboard Administrateur
- Vue d'ensemble des statistiques :
  - Chiffre d'affaires
  - Nombre de commandes
  - Panier moyen
  - Produits les plus vendus
- Graphiques et analyses par période
- Export des données (CSV, Excel)

### 🎨 Interface Utilisateur
- Design responsive (mobile-first)
- Accessibilité (WCAG 2.1)
- Notifications toast en temps réel
- Compteur de notifications en temps réel : nouvelles commandes, messages, contacts (desktop uniquement)

---

## 📁 Architecture

```
PCS/
│
├── backend/                    # API REST Node.js
│   ├── src/
│   │   ├── controllers/       # Logique métier
│   │   ├── database/          # Configuration Sequelize
│   │   ├── middlewares/       # Auth, validation, errors
│   │   ├── models/            # Modèles Sequelize
│   │   ├── routes/            # Endpoints API
│   │   ├── schemas/           # Schemas JOI
│   │   ├── services/          # Services métier (Stripe, email)
│   │   └── utils/             # Shemas Sanitize-html
│   ├── uploads/
│   └── index.ts
│
├── frontend/                   # Application React
│   ├── src/
│   │   ├── api/               # Appels API
│   │   ├── components/        # Composants réutilisables
│   │   ├── hooks/             # Custom React hooks
│   │   ├── pages/             # Pages de l'application
│   │   ├── store/             # State management (Zustand)
│   │   ├── types/             # Types TypeScript
│   │   ├── utils/             # Helpers
│   │   └── app.tsx            # Point d'entrée
│   ├── public/                # Assets statiques
│   └── index.html
│
├── LICENSE                     # Licence MIT
└── README.md
```

---

## ⚙️ Installation

### Pré-requis

- **Node.js** ≥ 18.x
- **PostgreSQL** ≥ 14.x
- **npm** ou **pnpm**
- Compte **Stripe** (mode test pour développement)

---

### 1️⃣ Cloner le projet

```bash
git clone https://github.com/Matt7474/Padel-Club-Shop
cd Padel-Club-Shop
```

---

### 2️⃣ Configuration de la base de données

#### 🐘 Connexion à PostgreSQL

```bash
sudo -i -u postgres psql
```

#### 🗂️ Création du rôle et de la base

```sql
-- Création du rôle avec mot de passe
CREATE ROLE pcs WITH LOGIN PASSWORD 'pcs';

-- Création de la base de données
CREATE DATABASE pcs OWNER pcs;

-- Quitter PostgreSQL
\q
```

---

### 3️⃣ Installation et configuration du Backend

#### 📦 Installation des dépendances

```bash
cd backend
npm install
# ou pnpm install
```

#### 🔐 Configuration des variables d'environnement

```bash
# Copier le fichier d'exemple
cp .env.example .env.dev
```

Éditez le fichier `.env.dev` avec vos paramètres :

```env
# Server
NODE_ENV=development
PORT=5000

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=pcs
DB_USER=pcs
DB_PASSWORD=pcs

# JWT
JWT_SECRET=votre_secret_jwt_ultra_securise
JWT_EXPIRES_IN=7d

# Stripe
STRIPE_SECRET_KEY=sk_test_votre_cle_secrete_stripe
STRIPE_WEBHOOK_SECRET=whsec_votre_webhook_secret
STRIPE_PUBLISHABLE_KEY=pk_test_votre_cle_publique

# URLs
FRONTEND_URL=http://localhost:5173
BACKEND_URL=http://localhost:5000
```

#### 🗄️ Initialisation de la base de données

```bash
# Création des tables
npm run create
# ou pnpm run create

# Insertion des données de test
npm run seed
# ou pnpm run seed
```

> 🔑 **Mot de passe attendu lors du seed** : `pcs`

#### ▶️ Démarrer le serveur Backend

```bash
npm run dev
# ou pnpm run dev
```

Le backend sera accessible sur : **http://localhost:5000**

---

### 4️⃣ Installation et configuration du Frontend

#### 📦 Installation des dépendances

```bash
cd ../frontend
npm install
# ou pnpm install
```

#### 🔑 Configuration des variables d'environnement

```bash
# Copier le fichier d'exemple
cp .env.example .env.development
```

Éditez le fichier `.env.development` :

```env
VITE_API_URL=http://localhost:5000/api
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_votre_cle_publique
```

#### ▶️ Démarrer le serveur Frontend

```bash
npm run dev
# ou pnpm run dev
```

Le frontend sera accessible sur : **http://localhost:5173**

---

### ✅ Vérification de l'installation

L'application est maintenant opérationnelle :

- **Frontend** : http://localhost:5173
- **Backend API** : http://localhost:5000
- **Base de données** : PostgreSQL sur le port 5432

Vous pouvez vous connecter avec le compte de test :
- **Email** : `tony.stark@test.com`
- **Mot de passe** : `Password1`

---

## 💳 Intégration Stripe

### Configuration

1. **Créer un compte Stripe** : [https://dashboard.stripe.com/register](https://dashboard.stripe.com/register)

2. **Récupérer les clés API** (mode test) :
   - Dashboard → Developers → API keys
   - Copier `Publishable key` et `Secret key`

3. **Configurer les webhooks** :
   - Dashboard → Developers → Webhooks
   - Ajouter un endpoint : `https://votre-api.com/api/webhooks/stripe`
   - Sélectionner les événements :
     - `payment_intent.succeeded`
     - `payment_intent.payment_failed`
     - `charge.refunded`

### Tunnel de test (développement local)

Pour tester les webhooks Stripe en local, utilisez **Stripe CLI** :

```bash
# Installer Stripe CLI
# macOS
brew install stripe/stripe-cli/stripe

# Windows
scoop bucket add stripe https://github.com/stripe/scoop-stripe-cli.git
scoop install stripe

# Se connecter
stripe login

# Créer un tunnel vers votre API locale
stripe listen --forward-to localhost:5000/api/webhooks/stripe

# Copier le webhook secret généré (whsec_...) dans votre .env
```

### Cartes de test Stripe

| Numéro de carte | Description | Résultat |
|-----------------|-------------|----------|
| `4242 4242 4242 4242` | Visa | ✅ Paiement réussi |
| `4000 0000 0000 9995` | Visa | ❌ Fonds insuffisants |
| `4000 0000 0000 0002` | Visa | ❌ Carte refusée |

**Autres infos de test** :
- Date d'expiration : n'importe quelle date future (ex: 12/34)
- CVV : n'importe quel code 3 chiffres (ex: 123)

---

## 🔑 Rôles et Permissions

| Rôle | Produits | Commandes | Utilisateurs | Promotions | Stats |
|------|----------|-----------|--------------|------------|-------|
| **SuperAdmin** | ✅ CRUD | ✅ Toutes | ✅ Tous | ✅ CRUD | ✅ Toutes |
| **Admin** | ✅ CRUD | ✅ Toutes | ✅ Sauf SuperAdmin | ✅ CRUD | ✅ Toutes |
| **Testeur** | ✅ CRUD | ✅ Lecture | ❌ Aucun | ✅ Lecture | ✅ Lecture |
| **Client** | 👁️ Lecture | 👁️ Ses commandes | 👁️ Son profil | ❌ - | ❌ - |

---

## 🎭 Mode Démo

Le mode démo permet de tester l'application sans impacter les données réelles :

- ✅ **Utilisateurs de test** préchargés
- ✅ **Produits d'exemple** avec images
- ✅ **Commandes simulées** avec statuts variés
- ✅ **Réinitialisation automatique quotidienne** à 2h00 (heure serveur)
- ✅ **Paiements Stripe en mode test**

### ⚠️ Réinitialisation automatique

> **Important** : La base de données est sauvegardée automatiquement chaque jour à **1h59** puis remise à zéro à **2h00** (UTC+1).
> 
> **Pourquoi cette approche ?**
> - 🛡️ Éviter l'accumulation de contenu inapproprié ou malveillant
> - 🖼️ Limiter le stockage d'images abusives sur le serveur
> - 🔄 Garantir un environnement de démonstration toujours propre et fonctionnel
> - ⚡ Maintenir des performances optimales de la base de données
> 
> Cette automatisation est mise en place via **cron job** côté serveur et permet de maintenir l'application accessible publiquement sans modération manuelle quotidienne.
> 
> **Politique de rétention** : Les sauvegardes sont conservées pendant **30 jours** avant suppression automatique, permettant une restauration en cas de besoin tout en gérant l'espace disque de manière optimale.
> 
> **Note** : Toutes les modifications (produits, commandes, utilisateurs créés après le seed initial) seront perdues après 2h00.

### Compte de test

| Email | Mot de passe | Rôle |
|-------|--------------|------|
| `tony.stark@test.com` | `Password1` | Testeur (équivalent admin) |

---

## 📄 Licence

Ce projet est sous licence **MIT**. Voir le fichier [LICENSE](./LICENSE) pour plus de détails.

```
MIT License

Copyright (c) 2025 PCS - Padel Club Shop

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

[...]
```

---

## 📞 Contact

- **Auteur** : Matt7474
- **Email** : dimier.matt.dev@gmail.com
- **Repository** : [github.com/Matt7474/Padel-Club-Shop](https://github.com/Matt7474/Padel-Club-Shop)

---

⭐ **Si ce projet vous plaît, n'oubliez pas de lui donner une étoile sur GitHub !**