"Contexte Technique de l'Application \"Les Canotiers\"":
  "Vision et Objectifs du Projet": "L'objectif est de reconstruire l'application \"Les Canotiers\" en une Web App moderne, performante et maintenable. L'application restera un outil de gestion et de suivi pour le maraîchage, mais avec une architecture technique robuste, une expérience utilisateur optimisée (y compris en mode hors ligne) et des pratiques de développement rigoureuses."
  "Concepts Métier Fondamentaux":
    description: "Le cœur métier reste inchangé et s'articule autour des entités suivantes :"
    entities[7]{name,details}:
      Utilisateurs,"(`users`): Gérés via Supabase Auth, avec des rôles (`admin`, `employee`)."
      Parcelles,"(`parcels`): Terrains de culture."
      Catégories de légumes,"(`vegetable_categories`): Regroupements (ex: \"légumes racines\")."
      Légumes,"(`vegetables`): Types de culture (ex: \"Tomate\")."
      Cycles,"(`cycles`): Association d'un légume et d'une parcelle sur une période donnée."
      Activités,"(`activities`): Tâches prédéfinies (ex: \"Semis\", \"Récolte\")."
      Temps Passés,"(`times`): Entrées de journal de travail associant un utilisateur, un cycle, une activité, une date, une durée et une quantité optionnelle."
  "Architecture et Stack Technique":
    "Framework Frontend": "**React 19+** avec **TypeScript** et **MUI**. Utilisation des Hooks, du Context API et de composants fonctionnels."
    "Build Tool": **Vite** pour un développement rapide et un bundling optimisé (ESM natif).
    "Base de Données et Backend (BaaS)":
      name: **Supabase**.
      details[4]: "**Base de données** : PostgreSQL.","**Authentification** : Supabase Auth pour la gestion des utilisateurs (email/mot de passe).","**APIs** : APIs RESTful auto-générées et client JavaScript (`@supabase/supabase-js`) pour interagir avec la base de données.","**Realtime** : Utilisation des subscriptions Supabase pour des mises à jour en temps réel si nécessaire (ex: notifications)."
    "Gestion de l'État (State Management)":
      "État serveur": "**TanStack Query (React Query)** pour le fetching, le caching, et la synchronisation des données avec Supabase. Indispensable pour gérer l'état asynchrone (loading, error, success)."
      "État client global": "**React Context** pour les états globaux légers (thème, état de la navigation, informations utilisateur)."
    "Gestion du Hors Ligne (Offline-First)":
      "PWA (Progressive Web App)": Utilisation d'un **Service Worker** pour mettre en cache l'application (Application Shell) et les ressources statiques.
      "Synchronisation des données": "Les mutations (création/modification d'entrées `times`) effectuées hors ligne seront stockées localement (ex: `localStorage` ou `IndexedDB`). Un mécanisme de file d'attente (queue) sera implémenté pour synchroniser ces données avec Supabase dès que la connexion est rétablie. Un indicateur visuel de l'état de synchronisation sera affiché dans l'UI."
    "Hébergement et Déploiement": **Vercel**. Intégration continue avec le dépôt GitHub pour des déploiements automatiques sur push/merge sur la branche principale.
    "Gestion de Code Source": **Git** & **GitHub**.
  "Modèle de Données (Tables Supabase)": "```sql\n-- Authentification gérée par Supabase, avec une table `profiles` pour les données publiques.\nCREATE TABLE profiles (\n  id UUID PRIMARY KEY REFERENCES auth.users(id),\n  username TEXT UNIQUE,\n  role TEXT NOT NULL DEFAULT 'employee' -- 'admin' or 'employee'\n);\n\nCREATE TABLE parcels (\n  id SERIAL PRIMARY KEY,\n  name TEXT NOT NULL UNIQUE,\n  created_at TIMESTAMPTZ DEFAULT NOW()\n);\n\nCREATE TABLE vegetable_categories (\n  id SERIAL PRIMARY KEY,\n  name TEXT NOT NULL UNIQUE,\n  created_at TIMESTAMPTZ DEFAULT NOW()\n);\n\nCREATE TABLE vegetables (\n  id SERIAL PRIMARY KEY,\n  name TEXT NOT NULL UNIQUE,\n  category_id INT REFERENCES vegetable_categories(id),\n  created_at TIMESTAMPTZ DEFAULT NOW()\n);\n\nCREATE TABLE cycles (\n  id SERIAL PRIMARY KEY,\n  vegetable_id INT NOT NULL REFERENCES vegetables(id),\n  parcel_id INT NOT NULL REFERENCES parcels(id),\n  starts_at DATE NOT NULL,\n  ends_at DATE NOT NULL,\n  created_at TIMESTAMPTZ DEFAULT NOW()\n);\n\nCREATE TABLE activities (\n  id SERIAL PRIMARY KEY,\n  name TEXT NOT NULL UNIQUE,\n  created_at TIMESTAMPTZ DEFAULT NOW()\n);\n\nCREATE TABLE times (\n  id SERIAL PRIMARY KEY,\n  user_id UUID NOT NULL REFERENCES profiles(id),\n  cycle_id INT NOT NULL REFERENCES cycles(id) ON DELETE CASCADE,\n  activity_id INT NOT NULL REFERENCES activities(id),\n  date DATE NOT NULL,\n  minutes INT NOT NULL,\n  quantity NUMERIC(10, 2), -- Pour les récoltes, etc.\n  created_at TIMESTAMPTZ DEFAULT NOW()\n);\n```"
  "Bonnes Pratiques et Conventions":
    "Qualité de Code":
      Linting: **BiomeJS** avec @biomejs/biome.
      Formatage: **BiomeJS** pour un style de code unifié et automatique. Un script `pre-commit` (via Husky) formatera le code avant chaque commit.
    "Conventions de Commits": "Utilisation de [Gitmoji](https://gitmoji.dev/) pour les messages de commit afin de standardiser et d'améliorer la lisibilité de l'historique Git. Les commits doivent être petits et atomiques."
    "Architecture des Composants": "Organisation des composants par fonctionnalité (feature-based). Les composants devront être typés et, si possible, génériques."
    Tests:
      "Tests Unitaires / Intégration": **Vitest** pour tester les composants et les hooks de manière isolée.
    "Communication API":
      "Utilisation du client": `@supabase/supabase-js`.
      "Génération des types": TypeScript à partir du schéma de la base de données Supabase (`supabase gen types typescript`) pour une API entièrement typée et sécurisée.
    "CI/CD (Intégration et Déploiement Continus)":
      "GitHub Actions": Workflow pour lancer automatiquement les linters et les tests à chaque Pull Request.
      "Déploiement Vercel": Déploiement automatique de la branche `main` en production et création d'aperçus pour chaque Pull Request.
    "Gestion des Erreurs":
      "Error Boundaries": Utilisation des `Error Boundaries` de React pour capturer les erreurs de rendu.
      "Reporting des erreurs": en production avec un service comme Sentry ou directement dans les logs Vercel.
  Conclusion: "Ce document sert de fondation technique pour guider le développement, assurer la cohérence et atteindre un haut niveau de qualité pour la nouvelle version de \"Les Canotiers\". Il faut TOUJOURS et IMPERATIVEMENT lancer l'agent skills project-orchestrator qui s'occupera d'appeler les bons agents skills."