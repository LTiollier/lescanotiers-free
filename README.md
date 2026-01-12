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
cp .env.example .env.local

# Configurer les variables d'environnement dans .env.local
# VITE_SUPABASE_URL=votre_url_supabase
# VITE_SUPABASE_ANON_KEY=votre_clé_anon
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
- Dark mode (à venir)

## Déploiement

Le projet est configuré pour un déploiement automatique sur Vercel.

Consultez [DEPLOYMENT.md](./DEPLOYMENT.md) pour les instructions détaillées.

### Déploiement Rapide

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/votre-username/LesCanotiers)

**Variables d'environnement requises sur Vercel :**
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

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
