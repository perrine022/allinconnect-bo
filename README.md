# AllinConnect - Backoffice

Backoffice de gestion pour la plateforme AllinConnect, permettant la gestion des utilisateurs, offres, abonnements, cagnottes et statistiques.

## 🚀 Technologies

- **Next.js 14+** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Lucide React** (Icônes)

## 📋 Prérequis

- Node.js 18+ 
- npm, yarn, pnpm ou bun

## 🛠️ Installation

1. Cloner le repository
```bash
git clone <repository-url>
cd allinconnect-bo
```

2. Installer les dépendances
```bash
npm install
# ou
yarn install
# ou
pnpm install
```

3. Configurer les variables d'environnement

Créer un fichier `.env.local` à la racine du projet :
```env
NEXT_PUBLIC_API_URL=http://localhost:8080
```

4. Lancer le serveur de développement
```bash
npm run dev
# ou
yarn dev
# ou
pnpm dev
```

5. Ouvrir [http://localhost:3000](http://localhost:3000) dans votre navigateur

## 📁 Structure du projet

```
allinconnect-bo/
├── src/
│   ├── app/                    # Pages Next.js (App Router)
│   │   ├── page.tsx           # Page de connexion
│   │   ├── dashboard/         # Dashboard principal
│   │   │   └── page.tsx      # Page du dashboard avec tous les onglets
│   │   ├── layout.tsx         # Layout principal
│   │   └── globals.css        # Styles globaux
│   ├── config/                # Configuration
│   │   └── api.ts            # Configuration de l'API
│   ├── services/              # Services API
│   │   ├── api.ts            # Client API de base
│   │   ├── authApi.ts        # Service d'authentification
│   │   ├── usersApi.ts       # Service de gestion des utilisateurs
│   │   ├── offersApi.ts      # Service de gestion des offres
│   │   ├── subscriptionsApi.ts # Service de gestion des abonnements
│   │   ├── statisticsApi.ts  # Service de statistiques
│   │   └── walletApi.ts      # Service de gestion de la cagnotte
│   └── types/                 # Types TypeScript
│       └── index.ts          # Définitions de types
├── public/                    # Fichiers statiques
└── package.json
```

## 🎯 Fonctionnalités

### 🔐 Authentification
- Connexion sécurisée avec email et mot de passe
- Gestion de session via localStorage
- Redirection automatique si non authentifié

### 📊 Dashboard - Statistiques
Nouvel onglet dédié aux statistiques globales de la plateforme :
- **Utilisateurs** : Total, actifs, professionnels, clients, revenus des pros
- **Abonnements** : Répartition par type (FREE/PREMIUM) et par catégorie (INDIVIDUAL/FAMILY/PROFESSIONAL)
- **Offres** : Total, actives, inactives, répartition par type (OFFRE/EVENEMENT)
- **Revenus** : Totaux, mensuels, revenus des professionnels
- **Cagnotte** : Solde total, nombre de transactions, demandes en attente

### 👥 Gestion des Utilisateurs
- Liste complète des utilisateurs (professionnels et clients)
- Recherche par nom, email, ville
- Édition des profils utilisateurs
- Affichage des informations détaillées (abonnements, cagnotte, etc.)

### 🏷️ Gestion des Offres
- Liste de toutes les offres
- Recherche par titre ou description
- Édition des offres (titre, description, prix, dates, statut, etc.)
- Filtrage par type (OFFRE/EVENEMENT) et statut (ACTIVE/INACTIVE/DRAFT)

### 💰 Gestion des Abonnements et Prix
- Liste des plans d'abonnement disponibles
- Historique des paiements
- Statistiques de revenus par mois
- Visualisation des abonnements actifs

### 💳 Gestion de la Cagnotte
- Historique des transactions (crédits/débits)
- Liste des demandes de retrait
- Suivi des statuts des demandes (PENDING/APPROVED/REJECTED/COMPLETED)

## 🔌 API Backend

Le backoffice communique avec une API backend. Les endpoints suivants sont utilisés :

### Authentification
- `POST /api/v1/auth/signin` - Connexion

### Statistiques
- `GET /api/v1/statistics/dashboard` - Dashboard complet (stats actuelles + historique)
- `GET /api/v1/statistics/current` - Statistiques du mois en cours
- `GET /api/v1/statistics/history` - Historique des statistiques
- `GET /api/v1/statistics/detailed` - **Nouveau** : Statistiques détaillées pour l'onglet dédié
- `POST /api/v1/statistics/freeze-previous` - Figer le mois précédent
- `POST /api/v1/statistics/freeze` - Figer un mois spécifique

### Utilisateurs
- `GET /api/v1/users/professionals` - Liste des professionnels
- `GET /api/v1/users/professionals/search` - Recherche de professionnels
- `PUT /api/v1/users/profile` - Mise à jour du profil

### Offres
- `GET /api/v1/offers` - Liste des offres

### Abonnements
- `GET /api/v1/subscriptions/plans` - Liste des plans
- `GET /api/v1/subscriptions/my-payments` - Historique des paiements

### Cagnotte
- `GET /api/v1/wallet/history` - Historique des transactions
- `GET /api/v1/wallet/requests` - Demandes de retrait

## 📝 Format de réponse attendu pour `/api/v1/statistics/detailed`

```json
{
  "users": {
    "total": 150,
    "active": 120,
    "professionals": 80,
    "clients": 70,
    "totalRevenue": 15000.00
  },
  "subscriptions": {
    "byType": {
      "FREE": 30,
      "PREMIUM": 90
    },
    "byCategory": {
      "INDIVIDUAL": 50,
      "FAMILY": 40,
      "PROFESSIONAL": 30
    },
    "totalActive": 120
  },
  "offers": {
    "total": 200,
    "active": 150,
    "inactive": 50,
    "byType": {
      "OFFRE": 180,
      "EVENEMENT": 20
    }
  },
  "revenue": {
    "total": 50000.00,
    "monthly": 5000.00,
    "fromProfessionals": 15000.00
  },
  "wallet": {
    "totalBalance": 5000.00,
    "totalTransactions": 500,
    "pendingRequests": 10
  }
}
```

## 🎨 Interface

L'interface utilise Tailwind CSS pour un design moderne et responsive :
- Design épuré et professionnel
- Cartes de statistiques avec codes couleur
- Tableaux interactifs avec recherche
- Modales pour l'édition
- États de chargement et gestion d'erreurs

## 🚀 Build pour la production

```bash
npm run build
npm start
```

## 📦 Déploiement

Le projet peut être déployé sur Vercel, Netlify ou tout autre hébergeur supportant Next.js.

### Variables d'environnement requises
- `NEXT_PUBLIC_API_URL` : URL de l'API backend

## 🔒 Sécurité

- Authentification requise pour accéder au dashboard
- Tokens stockés dans localStorage (à améliorer avec des cookies httpOnly en production)
- Validation côté client et serveur

## 📄 Licence

Propriétaire - AllinConnect

## 👥 Contribution

Pour contribuer au projet, veuillez créer une branche depuis `main` et soumettre une pull request.
