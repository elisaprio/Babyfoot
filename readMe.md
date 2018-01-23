## Outils
- Installation de Node
- PostgreSQL et PgAdmin4

## Installation
- Copie du projet :
```
$ git clone https://gitlab.com/elisaprio/babyfootEP/
```
- Installation des node modules :
```
$ npm install
```

## Base de données
- Creation de la BD dans pgadmin4
- Changer les paramètres de config (port sur laquelle est la BD, nom, user et password) dans les fichiers: 
```
$ public/databases/database.js
$ public/javascripts/queries.js
```
- Lancement du code qui ajoute la table à la base de données (si ce n'est pas fait via pgAdmin4) :
```
$ node databases/database.js
```

## Execution
- Lancement du serveur :
```
$ npm run start
```
- Lancement du client (connexion dans le navigateur) :
```
$ http://localhost:3000
```
