# Démarrage

Ce document vise une audience particulère: les enseignants du Collège Ahuntsic. Puisque ne n'avons pas publié la app sur un des App store, nous expliquons comment monter la app dans un émulateur. Par la suite nous montrons son fonctionnement.

## Quick Start

### Lancer la App

#### Web

Dans chacun dossiers `backend` et `frontend` il faut installer les dépendances:

```
npm i
```

Dans `backend` il faut rouler la commande:

```
node index.js
```

Dans `frontend` il faut rouler la commande:

```
ionic serve
```

#### IOS

Dans le dossier `frontend` entrez la commandes suivante:

```
ionic capacitor build ios
```

#### Android

Dans le dossier `frontend` entrez la commandes suivante:

```
ionic capacitor build android
```

Android Studio s'ouvrira. Ensuite il faut modifier l'appel au localhost. Pesez sur 'cmd'+'shift'+'p' pour ouvrir la recherche globale. replacez toutes les instances de `localhost` par `10.0.2.2`.

`!` en ce moment android fait des bugs.`!`

###### Instructions

Documentation (si possible) : Votre documentation devrait expliquer clairement l'utilisation de votre API Web, le schéma de votre base de données et toutes autres informations pertinentes. Elle doit être facile à comprendre et directement liée à votre application. Le format est libre (.md, .docx, .html, .PDF...)

##
