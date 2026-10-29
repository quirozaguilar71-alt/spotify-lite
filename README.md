# spotify-lite

Spotify-like music experience with a self-hosted backend, real authentication, and local audio uploads.

## Features

- JWT-based authentication with signup/login
- Local file upload for MP3/audio tracks
- Real audio playback from uploaded files or preview URLs
- Search by artist, album, title, or genre
- Dashboard with stats and playlist views
- SQLite persistence for users, tracks, and playlists

## Stack

- Frontend: React + Vite
- Backend: Node.js + Express
- Database: SQLite
- Auth: JWT + bcrypt
- Uploads: Multer

## Run locally

```bash
npm install
npm run dev
```

Then open:

- Frontend: http://localhost:5173
- API: http://localhost:4000/api/health

## Demo account

- Username: admin
- Password: admin123

## Notes

This app is intended as a self-hosted Spotify-style base. You can continue by adding favorites, artist pages, playlists, visualizers, or a better production deployment.
