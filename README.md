# PCS - Padel Club Shop

**PCS - Padel Club Shop** est une application e-commerce dédiée à la vente de matériel de padel, développée en **Node.js / React / TypeScript**. Elle propose une gestion complète des produits, commandes, utilisateurs et promotions, avec une interface utilisateur moderne et un tableau de bord d'administration performant.

---

## 🌐 Stack Technique

- **Frontend** : React + TypeScript + TailwindCSS  
- **Backend** : Node.js + Express + TypeScript  
- **Base de données** : PostgreSQL  
- **ORM** : Sequelize  
- **Authentification** : JWT  
- **Déploiement** :
  - Frontend : o2switch  
  - Backend + Base de données : IONOS  
- **Architecture** : Monorepo

---

## 🧩 Fonctionnalités

### Authentification & Rôles
- Gestion des utilisateurs avec rôles :  
  - **Super Admin** : contrôle total  
  - **Admin** : gestion produits et commandes (sauf Super Admin)  
  - **Client** : accès au catalogue, panier et commandes  
  - **Testeur** : accès limité, ne peut pas modifier d’autres utilisateurs  

### Gestion des produits
- CRUD complet des produits  
- Upload et gestion des images  
- Gestion des promotions et prix spéciaux  

### Gestion des commandes
- Création, traitement et suivi des commandes  
- Gestion des paiements et remboursements  
- Tableau de bord avec statistiques : panier moyen, ventes, catégories  

### Espace utilisateur
- Profil complet  
- Messagerie instantanée vers un admin
- Historique des commandes et factures  
- Gestion des adresses de livraison et facturation  

### Mode démo
- Réinitialisation automatique des images et données de test pour faciliter les essais  

---

## ⚙️ Installation et Développement

### Pré-requis
- Node.js >= 18  
- PostgreSQL >= 14  
- Yarn ou npm  

### Installation
```bash
# Cloner le projet
git clone https://github.com/Matt7474/pcs.git
cd pcs

# Installer les dépendances
npm install
# ou
yarn install



PCS (Monorepo)
│
├─ /backend (Node.js + Express + TypeScript)
│   ├─ /controllers
│   ├─ /routes
│   ├─ /models (Sequelize)
│   ├─ /middlewares
│   └─ app.ts
│
├─ /frontend (React + Vite + Tailwind)
│   ├─ /components
│   ├─ /pages
│   ├─ /store
│   └─ main.tsx
│
└─ /scripts
    └─ seed-demo-data.ts
```

### 🔑 Rôles et Permissions
**Rôle** : *Permissions principales*  
**SuperAdmin** : Tout contrôler (produits, commandes, utilisateurs)   
**Admin** : Gestion produits, commandes et utilisateurs (sauf Super Admin)   
**Testeur** : Gestion produits et commandes (sauf utilisateurs)  
**Client** : Catalogue, panier, achat, commandes   

### 📝 Notes sur le mode démo

Permet de tester l’application sans impacter les données réelles   
Réinitialise quotidiennement les données de test apres une sauvegarde.