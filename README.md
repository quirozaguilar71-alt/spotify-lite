# spotify-lite

Spotify-style music app with a Node/Express backend and a React frontend. This starter is designed as a self-hosted, ad-free music experience you can customize and extend.

## Features

- User-friendly dashboard inspired by Spotify
- Express API with SQLite persistence
- Search by artist, album, or title
- Featured playlists and curated library
- Audio preview support using public sample URLs
- Ready for local music library integration

## Stack

- Frontend: React + Vite
- Backend: Node.js + Express
- Database: SQLite

## Run locally

```bash
npm install
npm run dev
```

Then open:

- Frontend: http://localhost:5173
- API: http://localhost:4000/api/health

## Production build

```bash
npm run build
npm start
```

## Project structure

```text
server/         Backend code and database
src/            Frontend React app
index.html      Vite entry
vite.config.js  Vite config
package.json    Scripts and dependencies
```

## Notes

This repo includes a demo music catalog and sample preview URLs. Replace them with your own audio files and artwork when you want to run your own library.
