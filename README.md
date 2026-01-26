# Les Canotiers

Application de gestion pour Les Canotiers - Club de canoë-kayak.

## Technologies

- **Frontend** : React 19 + TypeScript + Vite
- **UI** : Material-UI (MUI)
- **Backend** : Supabase (PostgreSQL + Auth)
- **Routing** : React Router v7
- **State Management** : TanStack Query
- **Testing** : Vitest + Testing Library
- **Code Quality** : Biome (linting & formatting)
- **PWA** : Vite Plugin PWA + Workbox
- **Déploiement** : Vercel

## Développement Local

### Prérequis

- Node.js 18+
- npm ou yarn
- Un projet Supabase configuré

### Installation

```bash
# Installer les dépendances
npm install

# Copier le fichier d'environnement
cp .env.example .env

# Configurer les variables d'environnement dans .env
# VITE_SUPABASE_URL=votre_url_supabase
# VITE_SUPABASE_PUBLISHABLE_KEY=votre_clé_publique
```

### Commandes Disponibles

```bash
# Démarrer le serveur de développement
npm run dev

# Builder pour la production
npm run build

# Prévisualiser le build de production
npm run preview

# Lancer les tests
npm run test

# Lancer les tests avec interface
npm run test:ui

# Lancer les tests avec couverture
npm run test:coverage

# Linting et formatage
npm run lint
npm run format
```

## Architecture

Le projet suit une architecture modulaire :

```
src/
├── components/         # Composants React réutilisables
├── features/          # Fonctionnalités par domaine métier
├── hooks/             # Custom React hooks
├── lib/               # Configuration des librairies (Supabase, etc.)
├── pages/             # Pages/routes de l'application
├── types/             # Types TypeScript et définitions de DB
└── utils/             # Fonctions utilitaires
```

## Fonctionnalités

- Authentification complète (connexion, inscription, réinitialisation)
- Gestion des rôles (Admin, Responsable, Membre)
- Gestion des parcelles de terrain
- Navigation responsive avec Material-UI
- Progressive Web App (PWA) avec mode hors ligne
- Notifications de mise à jour automatiques
- Installation sur mobile et desktop
- Service Worker pour le cache intelligent
- Dark mode (à venir)

## Progressive Web App (PWA)

L'application est une Progressive Web App complète qui offre :

### Fonctionnalités PWA

- **Installation** : L'application peut être installée sur n'importe quel appareil (mobile, tablette, desktop)
- **Mode Hors Ligne** : Fonctionne même sans connexion internet grâce au Service Worker
- **Mises à jour automatiques** : Notification automatique quand une nouvelle version est disponible
- **Cache intelligent** :
  - Cache-First pour les ressources statiques (CSS, JS, images)
  - Network-First pour les API Supabase (avec fallback sur le cache)
  - Expiration automatique des caches pour optimiser l'espace

### Tester la PWA en local

```bash
# Builder l'application
npm run build

# Prévisualiser le build (avec Service Worker activé)
npm run preview

# Ouvrir dans le navigateur
# L'application sera disponible sur http://localhost:4173
```

Pour tester l'installation PWA :
1. Ouvrir l'application dans Chrome/Edge
2. Cliquer sur l'icône d'installation dans la barre d'adresse
3. Ou utiliser le bouton "Installer" qui apparaît dans l'application

### Service Worker

Le Service Worker est automatiquement généré par Vite Plugin PWA et Workbox. Il gère :
- La mise en cache des assets statiques
- Le cache des requêtes API avec stratégie Network-First
- Les mises à jour en arrière-plan
- Le mode hors ligne

### Assets PWA

Les icônes et assets PWA sont situés dans le dossier `public/` :
- `android-icon-192x192.png` : Icône Android (192x192px)
- `apple-icon.png` : Icône iOS (180x180px)
- `favicon.ico` : Favicon du site
- `logo.jpg` : Logo principal (512x512px)
- `manifest.json` : Manifeste PWA avec métadonnées

## Déploiement

Le projet est configuré pour un déploiement automatique sur Vercel.

Consultez [DEPLOYMENT.md](./DEPLOYMENT.md) pour les instructions détaillées.

### Déploiement Rapide

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/votre-username/LesCanotiers)

**Variables d'environnement requises sur Vercel :**
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`

## Scripts Supabase

```bash
# Générer les types TypeScript depuis la DB
npm run db:types
```

## Tests

Le projet utilise Vitest pour les tests unitaires et d'intégration.

```bash
# Lancer tous les tests
npm run test

# Lancer les tests en mode watch
npm run test:watch

# Interface UI pour les tests
npm run test:ui
```

## Contribution

1. Créer une branche depuis `main`
2. Faire vos modifications
3. S'assurer que les tests passent
4. Créer une Pull Request

Les Pull Requests génèrent automatiquement un déploiement de preview sur Vercel.

## Licence

Propriétaire - Les Canotiers © 2026
