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

## Configuration Supabase Storage

L'application utilise Supabase Storage pour gérer les images des légumes. Voici comment configurer le bucket.

### Étape 1 : Créer le Bucket

1. Connectez-vous à [Supabase](https://app.supabase.com)
2. Sélectionnez votre projet
3. Allez dans **Storage** dans le menu latéral
4. Cliquez sur **"New bucket"**
5. Configurez le bucket :
   - **Name** : `vegetables-images`
   - **Public bucket** : Activé (pour permettre l'accès public aux images)
6. Cliquez sur **"Create bucket"**

### Étape 2 : Configurer les Policies RLS

Le bucket doit avoir des policies pour gérer l'accès aux images :

#### Policy 1 : Lecture publique (pour afficher les images)

```sql
CREATE POLICY "Public read access for vegetable images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'vegetables-images');
```

**Comment l'ajouter via l'interface :**
1. Allez dans **Storage > Policies**
2. Sélectionnez le bucket `vegetables-images`
3. Cliquez sur **"New policy"**
4. Choisissez **"Custom policy"**
5. Configurez :
   - **Policy name** : Public read access for vegetable images
   - **Policy command** : SELECT
   - **Target roles** : public
   - **USING expression** : `bucket_id = 'vegetables-images'`

#### Policy 2 : Upload pour les admins authentifiés

```sql
CREATE POLICY "Admin insert access for vegetable images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'vegetables-images'
  AND (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  )
);
```

**Comment l'ajouter via l'interface :**
1. Allez dans **Storage > Policies**
2. Sélectionnez le bucket `vegetables-images`
3. Cliquez sur **"New policy"**
4. Choisissez **"Custom policy"**
5. Configurez :
   - **Policy name** : Admin insert access for vegetable images
   - **Policy command** : INSERT
   - **Target roles** : authenticated
   - **WITH CHECK expression** :
     ```
     bucket_id = 'vegetables-images'
     AND (
       EXISTS (
         SELECT 1 FROM profiles
         WHERE profiles.id = auth.uid()
         AND profiles.role = 'admin'
       )
     )
     ```

#### Policy 3 : Suppression pour les admins authentifiés

```sql
CREATE POLICY "Admin delete access for vegetable images"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'vegetables-images'
  AND (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  )
);
```

**Comment l'ajouter via l'interface :**
1. Allez dans **Storage > Policies**
2. Sélectionnez le bucket `vegetables-images`
3. Cliquez sur **"New policy"**
4. Choisissez **"Custom policy"**
5. Configurez :
   - **Policy name** : Admin delete access for vegetable images
   - **Policy command** : DELETE
   - **Target roles** : authenticated
   - **USING expression** :
     ```
     bucket_id = 'vegetables-images'
     AND (
       EXISTS (
         SELECT 1 FROM profiles
         WHERE profiles.id = auth.uid()
         AND profiles.role = 'admin'
       )
     )
     ```

### Étape 3 : Ajouter la colonne image_url dans la table vegetables

Si ce n'est pas déjà fait, ajoutez la colonne `image_url` à la table `vegetables` :

```sql
ALTER TABLE vegetables
ADD COLUMN image_url TEXT;
```

**Via l'interface Supabase :**
1. Allez dans **Database > Tables**
2. Sélectionnez la table `vegetables`
3. Cliquez sur **"New column"**
4. Configurez :
   - **Name** : `image_url`
   - **Type** : `text`
   - **Nullable** : Coché (l'image est optionnelle)
5. Cliquez sur **"Save"**

### Étape 4 : Limites et Configuration

Par défaut, Supabase Storage a les limites suivantes (plan gratuit) :
- **Taille max par fichier** : 50 MB
- **Stockage total** : 1 GB

L'application est configurée pour :
- **Taille max par fichier** : 2 MB (validation côté client)
- **Formats acceptés** : JPEG, JPG, PNG, WebP

### Étape 5 : Vérification

Pour vérifier que tout fonctionne :

1. Connectez-vous à l'application en tant qu'admin
2. Allez dans **Gestion des Légumes**
3. Créez ou modifiez un légume
4. Ajoutez une image
5. Vérifiez que l'image s'affiche dans la liste et dans le formulaire de saisie des temps

### Structure des fichiers dans le bucket

Les images sont organisées par légume :
```
vegetables-images/
  ├── 1/
  │   └── vegetable-1-1673456789.jpg
  ├── 2/
  │   └── vegetable-2-1673456790.png
  └── 3/
      └── vegetable-3-1673456791.webp
```

Chaque image est nommée avec l'ID du légume et un timestamp pour éviter les collisions.

---

**Note** : Assurez-vous que les variables d'environnement Supabase sont correctement configurées avant de déployer, sinon l'application ne pourra pas se connecter à la base de données.
