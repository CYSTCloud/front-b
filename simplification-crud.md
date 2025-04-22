# Plan de simplification du CRUD

Ce document liste les fichiers à modifier pour simplifier drastiquement le code tout en conservant les fonctionnalités essentielles du CRUD.

## Fichiers à modifier

### 1. Liste des utilisateurs
**Fichier**: `src/app/users/user-list/user-list.component.html`
- Supprimer tout le CSS
- Simplifier la structure HTML
- Conserver uniquement le tableau avec les colonnes essentielles et les boutons d'action

### 2. Formulaire d'utilisateur
**Fichier**: `src/app/users/user-form/user-form.component.html`
- Supprimer tout le CSS
- Simplifier la structure HTML
- Conserver uniquement les champs de formulaire et les boutons

### 3. Détail d'utilisateur
**Fichier**: `src/app/users/user-detail/user-detail.component.html`
- Supprimer tout le CSS
- Simplifier la structure HTML
- Conserver uniquement les informations essentielles et les boutons d'action

### 4. Composant de liste d'utilisateurs
**Fichier**: `src/app/users/user-list/user-list.component.ts`
- Simplifier les méthodes
- Conserver uniquement les fonctionnalités essentielles

### 5. Composant de formulaire d'utilisateur
**Fichier**: `src/app/users/user-form/user-form.component.ts`
- Simplifier les méthodes
- Conserver uniquement les fonctionnalités essentielles

### 6. Composant de détail d'utilisateur
**Fichier**: `src/app/users/user-detail/user-detail.component.ts`
- Simplifier les méthodes
- Conserver uniquement les fonctionnalités essentielles

## Plan d'action

1. Simplifier le composant de liste d'utilisateurs
2. Simplifier le composant de formulaire d'utilisateur
3. Simplifier le composant de détail d'utilisateur
4. Tester les fonctionnalités après chaque modification

## Problèmes identifiés et solutions

### Problèmes actuels

1. **Problème de mise à jour en temps réel** : Les modifications apportées aux utilisateurs ne se répercutent pas immédiatement dans l'interface.

2. **Problème d'affichage des champs** : Certains champs (prénom et nom) ne s'affichent pas correctement dans la liste des utilisateurs ou ne sont pas correctement enregistrés dans la base de données.

3. **Problème de communication avec le backend** : Les requêtes PUT pour mettre à jour les utilisateurs pourraient ne pas fonctionner correctement.

4. **Incohérence entre le modèle frontend et backend** : Le backend utilise "firstname" (minuscule) tandis que le frontend utilise "firstName" (F majuscule). De même, le backend utilise "name" au lieu de "lastName".

### Solutions proposées

1. **Amélioration du service utilisateur** :
   - Vérifier que les requêtes HTTP sont correctement formatées
   - S'assurer que tous les champs sont bien envoyés dans les requêtes
   - Ajouter des logs pour déboguer les requêtes et réponses

2. **Correction du formulaire d'édition** :
   - S'assurer que tous les champs sont correctement liés au formulaire
   - Vérifier que les valeurs sont correctement extraites du formulaire lors de la soumission

3. **Amélioration de la gestion des erreurs** :
   - Ajouter des messages d'erreur plus explicites
   - Afficher les erreurs du backend à l'utilisateur

4. **Ajout d'un rafraîchissement automatique** :
   - Recharger les données après une création, mise à jour ou suppression

5. **Correction de l'incohérence des modèles** :
   - Adapter le modèle User du frontend pour correspondre au format du backend
   - Modifier les services pour mapper correctement les données entre frontend et backend

## Structure du modèle backend

```json
{
  "id": 0,
  "name": "string",         // Correspond à lastName dans le frontend
  "firstname": "string",    // Correspond à firstName dans le frontend
  "username": "string",
  "email": "string",
  "birthDate": "2025-04-22",
  "avatarUrl": "string"
}
```
