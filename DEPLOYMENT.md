# Guide de Déploiement - Les Canotiers

## Configuration Vercel

Ce projet est configuré pour être déployé automatiquement sur Vercel avec intégration continue GitHub.

### Prérequis

- Un compte Vercel (connectez-vous avec GitHub)
- Le projet GitHub "Les Canotiers" accessible
- Les variables d'environnement Supabase (URL et Anon Key)

### Étape 1 : Importer le Projet sur Vercel

1. Rendez-vous sur [vercel.com](https://vercel.com)
2. Cliquez sur **"Add New Project"**
3. Sélectionnez votre repository GitHub **"LesCanotiers"**
4. Vercel détectera automatiquement la configuration Vite

### Étape 2 : Configurer les Variables d'Environnement

Dans les paramètres du projet Vercel, ajoutez les variables suivantes :

#### Variables Requises

```
VITE_SUPABASE_URL=https://votre-projet.supabase.co
VITE_SUPABASE_ANON_KEY=votre_clé_anon_publique
```

**Où trouver ces valeurs ?**
1. Connectez-vous à [Supabase](https://app.supabase.com)
2. Sélectionnez votre projet
3. Allez dans **Settings > API**
4. Copiez l'**URL** et la **anon public key**

#### Configuration des Environnements

- **Production** : Ajoutez les variables pour l'environnement `Production`
- **Preview** : Ajoutez les mêmes variables pour `Preview` (pour les Pull Requests)
- **Development** : Optionnel, pour le développement local via Vercel CLI

### Étape 3 : Déployer

Une fois la configuration terminée :

1. Cliquez sur **"Deploy"**
2. Vercel construira et déploiera automatiquement votre application
3. Vous recevrez une URL de production (ex: `https://les-canotiers.vercel.app`)

### Déploiements Automatiques

#### Configuration des Vercel Checks (Protection CI)

Le projet est configuré pour que Vercel attende la validation de la CI GitHub Actions avant de déployer :

**Comment activer les Vercel Checks :**

1. Rendez-vous dans les **paramètres du projet Vercel**
2. Allez dans la section **Git → Deployment Protection**
3. Activez **"Required Status Checks"**
4. Sélectionnez le check : **"Vercel - lescanotiers-free: build-check"**

**Comportement :**
- Vercel attendra que le workflow CI (`.github/workflows/ci.yml`) réussisse avant de déployer
- Si la CI échoue (lint, tests, build), le déploiement sera bloqué
- Cette protection s'applique aussi bien aux déploiements de production qu'aux preview deployments

**Vérification du workflow CI :**
Le workflow effectue les étapes suivantes :
- Lint du code (ESLint)
- Tests unitaires (si activés)
- Build de production
- Notification à Vercel du statut

#### Branch Principale (Production)

Chaque `push` ou `merge` sur la branche `main` déclenche automatiquement :
- Un workflow CI GitHub Actions
- Validation : lint, tests, build
- Un nouveau build Vercel (après validation CI)
- Un déploiement en production

#### Pull Requests (Preview)

Chaque Pull Request génère automatiquement :
- Un workflow CI GitHub Actions
- Un **Preview Deployment** unique (après validation CI)
- Une URL de preview pour tester les changements
- Un commentaire GitHub avec le lien de preview

### Configuration du Projet

Le projet utilise la configuration suivante (définie dans `vercel.json`) :

- **Framework** : Vite
- **Build Command** : `npm run build`
- **Output Directory** : `dist`
- **Install Command** : `npm install`

#### Fonctionnalités Activées

1. **SPA Routing** : Toutes les routes sont redirigées vers `index.html` pour le routing client-side
2. **Headers de Sécurité** :
   - `X-Content-Type-Options: nosniff`
   - `X-Frame-Options: DENY`
   - `X-XSS-Protection: 1; mode=block`
   - `Referrer-Policy: strict-origin-when-cross-origin`
3. **Cache Optimisé** : Les assets statiques sont mis en cache pour 1 an

### Commandes Utiles

#### Déployer manuellement

```bash
# Installer la CLI Vercel
npm i -g vercel

# Se connecter
vercel login

# Déployer en preview
vercel

# Déployer en production
vercel --prod
```

#### Vérifier le build localement

```bash
# Builder le projet
npm run build

# Prévisualiser le build
npm run preview
```

#### Voir les logs de déploiement

1. Allez sur [vercel.com](https://vercel.com/dashboard)
2. Sélectionnez votre projet
3. Cliquez sur le déploiement souhaité
4. Consultez les logs dans l'onglet **"Building"** ou **"Functions"**

### Domaines Personnalisés

Pour ajouter un domaine personnalisé :

1. Allez dans **Settings > Domains** sur Vercel
2. Ajoutez votre domaine
3. Configurez les DNS selon les instructions Vercel
4. Le certificat SSL sera automatiquement provisionné

### Rollback

En cas de problème, vous pouvez facilement revenir à une version précédente :

1. Allez dans l'onglet **"Deployments"**
2. Trouvez le déploiement stable souhaité
3. Cliquez sur les trois points **"..."**
4. Sélectionnez **"Promote to Production"**

### Support et Documentation

- [Documentation Vercel](https://vercel.com/docs)
- [Vercel + Vite Guide](https://vercel.com/docs/frameworks/vite)
- [Vercel CLI Reference](https://vercel.com/docs/cli)

### Monitoring

Vercel fournit automatiquement :
- **Analytics** : Trafic, performance, Core Web Vitals
- **Logs** : Logs en temps réel des déploiements et de l'exécution
- **Alerts** : Notifications en cas d'erreur de déploiement

Accédez-y via le dashboard Vercel de votre projet.

---

**Note** : Assurez-vous que les variables d'environnement Supabase sont correctement configurées avant de déployer, sinon l'application ne pourra pas se connecter à la base de données.
