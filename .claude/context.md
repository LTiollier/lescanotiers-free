# Contexte Technique de l'Application "Les Canotiers"

## ⚠️ Directive Importante - Utilisation des Skills Agents

**TOUJOURS et IMPÉRATIVEMENT lancer le skill agent `project-orchestrator` pour toute tâche de développement.**

Le `project-orchestrator` s'occupera d'orchestrer et d'appeler les bons agents skills en fonction de la tâche à accomplir.

### Règles Obligatoires pour le `project-orchestrator`

1. **Documentation du skill utilisé** : À la fin de chaque tâche, le `project-orchestrator` DOIT écrire dans un fichier `.claude/last-skill-used.txt` le nom du skill agent qui a été utilisé pour accomplir la tâche, avec la date et heure.

2. **Commit obligatoire** : Après chaque tâche complétée avec succès, le `project-orchestrator` DOIT créer un commit Git avec un message utilisant Gitmoji qui décrit clairement les modifications effectuées.

## Vision et Objectifs du Projet

L'objectif est de reconstruire l'application "Les Canotiers" en une Web App moderne, performante et maintenable. L'application restera un outil de gestion et de suivi pour le maraîchage, mais avec une architecture technique robuste, une expérience utilisateur optimisée (y compris en mode hors ligne) et des pratiques de développement rigoureuses.

## Concepts Métier Fondamentaux

Le cœur métier reste inchangé et s'articule autour des entités suivantes :

- **Utilisateurs** (`users`) : Gérés via Supabase Auth, avec des rôles (`admin`, `employee`)
- **Parcelles** (`parcels`) : Terrains de culture
- **Catégories de légumes** (`vegetable_categories`) : Regroupements (ex: "légumes racines")
- **Légumes** (`vegetables`) : Types de culture (ex: "Tomate")
- **Cycles** (`cycles`) : Association d'un légume et d'une parcelle sur une période donnée
- **Activités** (`activities`) : Tâches prédéfinies (ex: "Semis", "Récolte")
- **Temps Passés** (`times`) : Entrées de journal de travail associant un utilisateur, un cycle, une activité, une date, une durée et une quantité optionnelle

## Architecture et Stack Technique

### Framework Frontend

**React 19+** avec **TypeScript** et **MUI**. Utilisation des Hooks, du Context API et de composants fonctionnels.

### Build Tool

**Vite** pour un développement rapide et un bundling optimisé (ESM natif).

### Base de Données et Backend (BaaS)

**Supabase** avec :

- **Base de données** : PostgreSQL
- **Authentification** : Supabase Auth pour la gestion des utilisateurs (email/mot de passe)
- **APIs** : APIs RESTful auto-générées et client JavaScript (`@supabase/supabase-js`) pour interagir avec la base de données
- **Realtime** : Utilisation des subscriptions Supabase pour des mises à jour en temps réel si nécessaire (ex: notifications)

### Gestion de l'État (State Management)

- **État serveur** : **TanStack Query (React Query)** pour le fetching, le caching, et la synchronisation des données avec Supabase. Indispensable pour gérer l'état asynchrone (loading, error, success)
- **État client global** : **React Context** pour les états globaux légers (thème, état de la navigation, informations utilisateur)

### Gestion du Hors Ligne (Offline-First)

- **PWA (Progressive Web App)** : Utilisation d'un **Service Worker** pour mettre en cache l'application (Application Shell) et les ressources statiques
- **Synchronisation des données** : Les mutations (création/modification d'entrées `times`) effectuées hors ligne seront stockées localement (ex: `localStorage` ou `IndexedDB`). Un mécanisme de file d'attente (queue) sera implémenté pour synchroniser ces données avec Supabase dès que la connexion est rétablie. Un indicateur visuel de l'état de synchronisation sera affiché dans l'UI

### Hébergement et Déploiement

**Vercel** avec intégration continue avec le dépôt GitHub pour des déploiements automatiques sur push/merge sur la branche principale.

### Gestion de Code Source

**Git** & **GitHub**

## Modèle de Données (Tables Supabase)

```sql
-- Authentification gérée par Supabase, avec une table `profiles` pour les données publiques.
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  username TEXT UNIQUE,
  role TEXT NOT NULL DEFAULT 'employee' -- 'admin' or 'employee'
);

CREATE TABLE parcels (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE vegetable_categories (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE vegetables (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  category_id INT REFERENCES vegetable_categories(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE cycles (
  id SERIAL PRIMARY KEY,
  vegetable_id INT NOT NULL REFERENCES vegetables(id),
  parcel_id INT NOT NULL REFERENCES parcels(id),
  starts_at DATE NOT NULL,
  ends_at DATE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE activities (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE times (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES profiles(id),
  cycle_id INT NOT NULL REFERENCES cycles(id) ON DELETE CASCADE,
  activity_id INT NOT NULL REFERENCES activities(id),
  date DATE NOT NULL,
  minutes INT NOT NULL,
  quantity NUMERIC(10, 2), -- Pour les récoltes, etc.
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

## Bonnes Pratiques et Conventions

### Qualité de Code

- **Linting** : **BiomeJS** avec @biomejs/biome
- **Formatage** : **BiomeJS** pour un style de code unifié et automatique. Un script `pre-commit` (via Husky) formatera le code avant chaque commit

### Conventions de Commits

Utilisation de [Gitmoji](https://gitmoji.dev/) pour les messages de commit afin de standardiser et d'améliorer la lisibilité de l'historique Git. Les commits doivent être petits et atomiques.

### Architecture des Composants

Organisation des composants par fonctionnalité (feature-based). Les composants devront être typés et, si possible, génériques.

### Tests

**Tests Unitaires / Intégration** : **Vitest** pour tester les composants et les hooks de manière isolée.

### Communication API

- **Utilisation du client** : `@supabase/supabase-js`
- **Génération des types** : TypeScript à partir du schéma de la base de données Supabase (`supabase gen types typescript`) pour une API entièrement typée et sécurisée

### CI/CD (Intégration et Déploiement Continus)

- **GitHub Actions** : Workflow pour lancer automatiquement les linters et les tests à chaque Pull Request
- **Déploiement Vercel** : Déploiement automatique de la branche `main` en production et création d'aperçus pour chaque Pull Request

### Gestion des Erreurs

- **Error Boundaries** : Utilisation des Error Boundaries de React pour capturer les erreurs de rendu
- **Reporting des erreurs** : En production avec un service comme Sentry ou directement dans les logs Vercel

## Conclusion

Ce document sert de fondation technique pour guider le développement, assurer la cohérence et atteindre un haut niveau de qualité pour la nouvelle version de "Les Canotiers".
