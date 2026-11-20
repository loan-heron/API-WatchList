# API WatchList

API Express pour gérer une liste de films. Les données sont stockées dans la table Supabase `films`.

## Démarrage

```bash
npm install
npm start
```

Le serveur utilise le port défini dans `.env` (`PORT=4001`).

## Routes

### Liste des films

`GET /api/films`

Paramètres optionnels :

- `genre` : SF, Drame, Comédie, Thriller ou Animation
- `status` : aVoir ou vu
- `search` : texte contenu dans le titre
- `sort` : title, year ou rating

```http
GET /api/films?genre=SF&status=vu&sort=year
```

Réponse : `200` avec un tableau de films.

### Détail d'un film

`GET /api/films/:id`

```http
GET /api/films/1
```

Réponse : `200` avec le film, ou `404` avec `{ "error": "Film introuvable" }`.

### Ajouter un film

`POST /api/films`

```json
{
  "title": "Interstellar",
  "genre": "SF",
  "year": 2014,
  "image": "images/interstellar.jpg"
}
```

Réponse : `201` avec le film créé. Le statut vaut `aVoir`, la note vaut `0` et l'image vaut `""` si elle est absente.

Une demande invalide retourne `400` avec un champ `error`.

### Ajouter une image

`POST /api/films` accepte aussi un fichier multipart nommé `image`.

```text
Content-Type: multipart/form-data

title: Interstellar
genre: SF
year: 2014
image: fichier-jpeg-ou-png
```

L'image est enregistrée dans `backend/images`. Le champ `image` du film contient son chemin relatif, par exemple `images/interstellar-123456.jpg`.

Elle est accessible depuis :

```text
http://localhost:3000/images/nom-du-fichier.jpg
```

### Modifier un film

`PATCH /api/films/:id`

```json
{
  "status": "vu",
  "rating": 4
}
```

Seuls `status` et `rating` sont acceptés. Le statut doit valoir `aVoir` ou `vu`, et la note doit être un entier de `0` à `5`.

Réponse : `200` avec le film modifié, `400` pour une valeur invalide ou `404` si le film n'existe pas.

### Supprimer un film

`DELETE /api/films/:id`

Réponse : `204` sans contenu, ou `404` avec `{ "error": "Film introuvable" }`.

## Peupler la base de données

Exécutez [data/seed-films.sql](data/seed-films.sql) dans l'éditeur SQL de Supabase.

Le script insère ou met à jour les 12 films du projet. Il peut être exécuté plusieurs fois sans créer de doublons.
