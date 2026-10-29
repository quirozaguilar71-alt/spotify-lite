import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Database from 'better-sqlite3';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import multer from 'multer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const PORT = process.env.PORT || 4000;
const JWT_SECRET = process.env.JWT_SECRET || 'spotify-lite-dev-secret';

const dataDir = path.join(__dirname, 'data');
const uploadDir = path.join(__dirname, 'uploads');

if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const dbPath = path.join(dataDir, 'spotify-lite.db');
const db = new Database(dbPath);
db.pragma('journal_mode = WAL');

const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, uploadDir),
  filename: (_, file, cb) => {
    const extension = path.extname(file.originalname) || '.mp3';
    const safeName = file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_');
    cb(null, `${Date.now()}-${safeName}${extension}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 80 * 1024 * 1024 },
  fileFilter: (_, file, cb) => {
    const allowed = file.mimetype.startsWith('audio/') || file.mimetype.includes('mpeg');
    if (allowed) {
      cb(null, true);
      return;
    }
    cb(new Error('Only audio files are allowed'));
  },
});

const createSchema = () => {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'user',
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS tracks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      artist TEXT NOT NULL,
      album TEXT NOT NULL,
      genre TEXT NOT NULL,
      duration INTEGER NOT NULL DEFAULT 0,
      cover TEXT NOT NULL,
      preview_url TEXT,
      file_name TEXT,
      owner_id INTEGER,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(owner_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS playlists (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT NOT NULL,
      cover TEXT NOT NULL,
      owner_id INTEGER,
      FOREIGN KEY(owner_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS playlist_tracks (
      playlist_id INTEGER NOT NULL,
      track_id INTEGER NOT NULL,
      FOREIGN KEY(playlist_id) REFERENCES playlists(id),
      FOREIGN KEY(track_id) REFERENCES tracks(id)
    );

    CREATE TABLE IF NOT EXISTS favorites (
      user_id INTEGER NOT NULL,
      track_id INTEGER NOT NULL,
      PRIMARY KEY (user_id, track_id),
      FOREIGN KEY(user_id) REFERENCES users(id),
      FOREIGN KEY(track_id) REFERENCES tracks(id)
    );
  `);
};

const tokenForUser = (user) => jwt.sign(
  {
    sub: user.id,
    username: user.username,
    role: user.role,
  },
  JWT_SECRET,
  { expiresIn: '7d' }
);

const serializeTrack = (track) => ({
  ...track,
  src: track.file_name ? `/uploads/${track.file_name}` : track.preview_url || '/api/health',
  owner_name: track.owner_name || 'admin',
});

const authMiddleware = (req, res, next) => {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ error: 'Authentication required.' });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    const user = db.prepare('SELECT id, username, role FROM users WHERE id = ?').get(payload.sub);

    if (!user) {
      return res.status(401).json({ error: 'Invalid session.' });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid or expired token.' });
  }
};

const seedAdmin = () => {
  const userCount = db.prepare('SELECT COUNT(*) AS count FROM users').get().count;
  if (userCount > 0) return;

  const passwordHash = bcrypt.hashSync('admin123', 10);
  db.prepare('INSERT INTO users (username, password_hash, role) VALUES (?, ?, ?)').run('admin', passwordHash, 'admin');
};

const demoTracks = [
  {
    title: 'Neon Skyline',
    artist: 'Luna Harbor',
    album: 'City Lights',
    genre: 'Electronic',
    duration: 214,
    cover: 'linear-gradient(135deg, #0ea5e9, #8b5cf6, #ec4899)',
    preview_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
  },
  {
    title: 'Golden Horizon',
    artist: 'Jasper Vale',
    album: 'Afterglow',
    genre: 'Indie Pop',
    duration: 246,
    cover: 'linear-gradient(135deg, #f97316, #facc15, #84cc16)',
    preview_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
  },
  {
    title: 'Midnight Echo',
    artist: 'Sora Bloom',
    album: 'Signal',
    genre: 'Synthwave',
    duration: 195,
    cover: 'linear-gradient(135deg, #ef4444, #f43f5e, #8b5cf6)',
    preview_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
  },
  {
    title: 'Velvet Tides',
    artist: 'Nova Drift',
    album: 'Blue Hour',
    genre: 'Dream Pop',
    duration: 231,
    cover: 'linear-gradient(135deg, #14b8a6, #06b6d4, #3b82f6)',
    preview_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
  },
  {
    title: 'The Long Way Home',
    artist: 'Aster Lane',
    album: 'Open Roads',
    genre: 'Folk',
    duration: 272,
    cover: 'linear-gradient(135deg, #a16207, #f59e0b, #facc15)',
    preview_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
  },
  {
    title: 'Glass Hearts',
    artist: 'Cinder Echo',
    album: 'Static Bloom',
    genre: 'Alternative',
    duration: 228,
    cover: 'linear-gradient(135deg, #ec4899, #f43f5e, #fb7185)',
    preview_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3',
  },
  {
    title: 'Sunset Avenue',
    artist: 'Milo Hart',
    album: 'Drive',
    genre: 'R&B',
    duration: 199,
    cover: 'linear-gradient(135deg, #f97316, #fb7185, #fdba74)',
    preview_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3',
  },
  {
    title: 'Northbound',
    artist: 'Harbor Noire',
    album: 'Night Signals',
    genre: 'Ambient',
    duration: 289,
    cover: 'linear-gradient(135deg, #1f2937, #334155, #64748b)',
    preview_url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3',
  },
];

const seedDemoTracks = () => {
  const trackCount = db.prepare('SELECT COUNT(*) AS count FROM tracks').get().count;
  if (trackCount > 0) return;

  const admin = db.prepare('SELECT id FROM users WHERE username = ?').get('admin');
  const insert = db.prepare(`
    INSERT INTO tracks (title, artist, album, genre, duration, cover, preview_url, owner_id)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  demoTracks.forEach((track) => {
    insert.run(
      track.title,
      track.artist,
      track.album,
      track.genre,
      track.duration,
      track.cover,
      track.preview_url,
      admin?.id || 1
    );
  });
};

const demoPlaylists = [
  {
    id: 1,
    name: 'Morning Drive',
    description: 'High-energy music to start the day.',
    cover: 'linear-gradient(135deg, #facc15, #f97316, #ef4444)',
    trackIds: [1, 2, 4],
  },
  {
    id: 2,
    name: 'Night Mode',
    description: 'Dark synths and cinematic ambience.',
    cover: 'linear-gradient(135deg, #7c3aed, #4338ca, #0f172a)',
    trackIds: [3, 5, 8],
  },
];

const ensurePlaylistSeeds = () => {
  const count = db.prepare('SELECT COUNT(*) AS count FROM playlists').get().count;
  if (count > 0) return;

  const insertPlaylist = db.prepare('INSERT INTO playlists (id, name, description, cover, owner_id) VALUES (?, ?, ?, ?, ?)');
  const insertTrack = db.prepare('INSERT INTO playlist_tracks (playlist_id, track_id) VALUES (?, ?)');

  demoPlaylists.forEach((playlist) => {
    const admin = db.prepare('SELECT id FROM users WHERE username = ?').get('admin');
    insertPlaylist.run(playlist.id, playlist.name, playlist.description, playlist.cover, admin?.id || 1);
    playlist.trackIds.forEach((trackId) => insertTrack.run(playlist.id, trackId));
  });
};

createSchema();
seedAdmin();
seedDemoTracks();
ensurePlaylistSeeds();

app.use(cors());
app.use(express.json({ limit: '25mb' }));
app.use('/uploads', express.static(uploadDir));

app.get('/api/health', (_, res) => {
  res.json({ ok: true, message: 'Spotify Lite API is running', timestamp: new Date().toISOString() });
});

app.post('/api/auth/register', (req, res) => {
  const username = String(req.body?.username || '').trim();
  const password = String(req.body?.password || '').trim();

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required.' });
  }

  if (username.length < 3 || password.length < 6) {
    return res.status(400).json({ error: 'Username must be at least 3 characters and password 6 characters.' });
  }

  const existing = db.prepare('SELECT id FROM users WHERE username = ?').get(username.toLowerCase());
  if (existing) {
    return res.status(409).json({ error: 'Username already exists.' });
  }

  const passwordHash = bcrypt.hashSync(password, 10);
  const result = db.prepare('INSERT INTO users (username, password_hash, role) VALUES (?, ?, ?)').run(username.toLowerCase(), passwordHash, 'user');
  const user = db.prepare('SELECT id, username, role FROM users WHERE id = ?').get(result.lastInsertRowid);

  return res.status(201).json({
    token: tokenForUser(user),
    user: { id: user.id, username: user.username, role: user.role },
  });
});

app.post('/api/auth/login', (req, res) => {
  const username = String(req.body?.username || '').trim().toLowerCase();
  const password = String(req.body?.password || '').trim();

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required.' });
  }

  const user = db.prepare('SELECT id, username, password_hash, role FROM users WHERE username = ?').get(username);
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials.' });
  }

  const matches = bcrypt.compareSync(password, user.password_hash);
  if (!matches) {
    return res.status(401).json({ error: 'Invalid credentials.' });
  }

  const safeUser = { id: user.id, username: user.username, role: user.role };
  return res.json({ token: tokenForUser(safeUser), user: safeUser });
});

app.get('/api/auth/me', authMiddleware, (req, res) => {
  const user = db.prepare('SELECT id, username, role FROM users WHERE id = ?').get(req.user.id);
  res.json({ user });
});

app.get('/api/tracks', (_, res) => {
  const tracks = db.prepare(`
    SELECT t.*, u.username AS owner_name
    FROM tracks t
    LEFT JOIN users u ON u.id = t.owner_id
    ORDER BY t.id DESC
  `).all();

  res.json({ tracks: tracks.map(serializeTrack) });
});

app.get('/api/search', (req, res) => {
  const query = String(req.query.q || '').trim();

  if (!query) {
    const tracks = db.prepare(`
      SELECT t.*, u.username AS owner_name
      FROM tracks t LEFT JOIN users u ON u.id = t.owner_id
      ORDER BY t.id DESC
    `).all();
    return res.json({ tracks: tracks.map(serializeTrack) });
  }

  const searchTerm = `%${query}%`;
  const tracks = db.prepare(`
    SELECT t.*, u.username AS owner_name
    FROM tracks t
    LEFT JOIN users u ON u.id = t.owner_id
    WHERE t.title LIKE ?
       OR t.artist LIKE ?
       OR t.album LIKE ?
       OR t.genre LIKE ?
    ORDER BY t.title ASC
  `).all(searchTerm, searchTerm, searchTerm, searchTerm);

  res.json({ tracks: tracks.map(serializeTrack) });
});

app.get('/api/dashboard', authMiddleware, (req, res) => {
  const totalTracks = db.prepare('SELECT COUNT(*) AS count FROM tracks').get().count;
  const totalUsers = db.prepare('SELECT COUNT(*) AS count FROM users').get().count;
  const uploadedByUser = db.prepare('SELECT COUNT(*) AS count FROM tracks WHERE owner_id = ?').get(req.user.id).count;

  res.json({
    stats: {
      totalTracks,
      totalUsers,
      uploadedByUser,
    },
  });
});

app.get('/api/favorites', authMiddleware, (req, res) => {
  const rows = db.prepare('SELECT track_id FROM favorites WHERE user_id = ? ORDER BY track_id ASC').all(req.user.id);
  const favoriteIds = rows.map((row) => row.track_id);

  let tracks = [];
  if (favoriteIds.length > 0) {
    const placeholders = favoriteIds.map(() => '?').join(',');
    tracks = db.prepare(`
      SELECT t.*, u.username AS owner_name
      FROM tracks t
      LEFT JOIN users u ON u.id = t.owner_id
      WHERE t.id IN (${placeholders})
      ORDER BY t.title ASC
    `).all(...favoriteIds);
  }

  res.json({ favoriteIds, tracks: tracks.map(serializeTrack) });
});

app.post('/api/favorites/toggle', authMiddleware, (req, res) => {
  const trackId = Number(req.body?.trackId);
  if (!trackId) {
    return res.status(400).json({ error: 'A valid track ID is required.' });
  }

  const exists = db.prepare('SELECT 1 FROM favorites WHERE user_id = ? AND track_id = ?').get(req.user.id, trackId);

  if (exists) {
    db.prepare('DELETE FROM favorites WHERE user_id = ? AND track_id = ?').run(req.user.id, trackId);
    return res.json({ liked: false, favoriteIds: db.prepare('SELECT track_id FROM favorites WHERE user_id = ? ORDER BY track_id ASC').all(req.user.id).map((row) => row.track_id) });
  }

  db.prepare('INSERT INTO favorites (user_id, track_id) VALUES (?, ?)').run(req.user.id, trackId);
  const favoriteIds = db.prepare('SELECT track_id FROM favorites WHERE user_id = ? ORDER BY track_id ASC').all(req.user.id).map((row) => row.track_id);
  return res.json({ liked: true, favoriteIds });
});

app.post('/api/playlists', authMiddleware, (req, res) => {
  const name = String(req.body?.name || '').trim();
  const description = String(req.body?.description || '').trim() || 'Personal playlist';

  if (!name) {
    return res.status(400).json({ error: 'Playlist name is required.' });
  }

  const insert = db.prepare(`
    INSERT INTO playlists (name, description, cover, owner_id)
    VALUES (?, ?, ?, ?)
  `);

  const result = insert.run(name, description, 'linear-gradient(135deg, #22c55e, #14b8a6, #0ea5e9)', req.user.id);
  const playlist = db.prepare('SELECT * FROM playlists WHERE id = ?').get(result.lastInsertRowid);

  return res.status(201).json({ playlist });
});

app.post('/api/playlists/:playlistId/tracks', authMiddleware, (req, res) => {
  const playlistId = Number(req.params.playlistId);
  const trackId = Number(req.body?.trackId);

  if (!playlistId || !trackId) {
    return res.status(400).json({ error: 'Playlist and track are required.' });
  }

  const playlist = db.prepare('SELECT * FROM playlists WHERE id = ?').get(playlistId);
  if (!playlist) {
    return res.status(404).json({ error: 'Playlist not found.' });
  }

  if (playlist.owner_id !== null && playlist.owner_id !== req.user.id && req.user.role !== 'admin') {
    return res.status(403).json({ error: 'You are not allowed to modify this playlist.' });
  }

  const exists = db.prepare('SELECT 1 FROM playlist_tracks WHERE playlist_id = ? AND track_id = ?').get(playlistId, trackId);
  if (exists) {
    return res.status(200).json({ added: false, message: 'Track already exists in playlist.' });
  }

  db.prepare('INSERT INTO playlist_tracks (playlist_id, track_id) VALUES (?, ?)').run(playlistId, trackId);
  return res.status(201).json({ added: true });
});

app.get('/api/playlists', (req, res) => {
  const playlists = db.prepare('SELECT * FROM playlists ORDER BY id ASC').all();
  const withTracks = playlists.map((playlist) => {
    const tracks = db.prepare(`
      SELECT t.*
      FROM playlist_tracks pt
      JOIN tracks t ON t.id = pt.track_id
      WHERE pt.playlist_id = ?
    `).all(playlist.id);

    return {
      ...playlist,
      tracks: tracks.map(serializeTrack),
    };
  });

  res.json({ playlists: withTracks });
});

app.post('/api/tracks/upload', authMiddleware, upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'A music file is required.' });
  }

  const title = String(req.body.title || path.parse(req.file.originalname).name).trim() || 'Untitled Track';
  const artist = String(req.body.artist || 'Unknown Artist').trim();
  const album = String(req.body.album || 'Unknown Album').trim();
  const genre = String(req.body.genre || 'Uncategorized').trim();
  const duration = Number(req.body.duration || 0);
  const fileName = req.file.filename;

  const record = db.prepare(`
    INSERT INTO tracks (title, artist, album, genre, duration, cover, preview_url, file_name, owner_id)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    title,
    artist,
    album,
    genre,
    duration,
    'linear-gradient(135deg, #22c55e, #14b8a6, #0ea5e9)',
    null,
    fileName,
    req.user.id
  );

  const inserted = db.prepare(`
    SELECT t.*, u.username AS owner_name
    FROM tracks t
    LEFT JOIN users u ON u.id = t.owner_id
    WHERE t.id = ?
  `).get(record.lastInsertRowid);

  return res.status(201).json({ track: serializeTrack(inserted) });
});

const distPath = path.join(__dirname, '../dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));

  app.get('*', (_, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Spotify Lite API is running at http://localhost:${PORT}`);
});
