* {
  box-sizing: border-box;
}

:root {
  font-family: Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  color: #f5f5f5;
  background: #080808;
  line-height: 1.5;
  font-weight: 400;
}

html, body, #root {
  margin: 0;
  min-height: 100%;
  height: 100%;
  background: #080808;
}

body {
  min-height: 100vh;
  background: linear-gradient(180deg, #121212 0%, #090909 15%, #090909 100%);
}

button,
input {
  font: inherit;
}

button {
  cursor: pointer;
}

.app-shell {
  display: grid;
  grid-template-columns: 260px minmax(0, 1fr);
  grid-template-rows: minmax(0, 1fr) 90px;
  min-height: 100vh;
  background: #090909;
}

.sidebar {
  grid-row: 1 / 2;
  background: rgba(18, 18, 18, 0.9);
  padding: 24px 18px;
  border-right: 1px solid rgba(255, 255, 255, 0.05);
}

.brand {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 28px;
  letter-spacing: -0.05em;
}

.nav {
  display: grid;
  gap: 10px;
}

.nav-item {
  border: none;
  text-align: left;
  background: transparent;
  color: #d9d9d9;
  border-radius: 12px;
  padding: 12px 14px;
  font-weight: 600;
}

.nav-item.active {
  background: rgba(255, 255, 255, 0.08);
  color: #fff;
}

.section-label {
  margin-top: 28px;
  color: #a8a8a8;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  font-size: 0.7rem;
  margin-bottom: 12px;
}

.mini-list {
  display: grid;
  gap: 8px;
}

.mini-item {
  display: flex;
  flex-direction: column;
  gap: 2px;
  color: #d4d4d4;
  background: rgba(255, 255, 255, 0.02);
  border-radius: 10px;
  padding: 10px 12px;
}

.mini-item small {
  color: #8d8d8d;
}

.content {
  grid-column: 2;
  padding: 22px 28px 24px;
  overflow-y: auto;
}

.topbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  margin-bottom: 18px;
}

.search-box {
  flex: 1;
}

.search-box input {
  width: 100%;
  border: 1px solid rgba(255,255,255,0.08);
  background: rgba(255,255,255,0.06);
  border-radius: 999px;
  padding: 12px 18px;
  color: white;
}

.login-button {
  background: #fff;
  color: #111;
  border: none;
  border-radius: 999px;
  padding: 10px 18px;
  font-weight: 700;
}

.hero-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: linear-gradient(135deg, #4d1d91 0%, #1a5a8f 100%);
  border-radius: 18px;
  padding: 30px 28px;
  margin-bottom: 32px;
}

.eyebrow {
  margin: 0 0 8px;
  font-size: 0.8rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  opacity: 0.8;
}

.hero-card h1 {
  margin: 0;
  font-size: clamp(2rem, 4vw, 3rem);
  letter-spacing: -0.07em;
}

.plan-pill {
  background: rgba(255,255,255,0.12);
  border: 1px solid rgba(255,255,255,0.2);
  padding: 8px 12px;
  border-radius: 999px;
  font-size: 0.85rem;
}

.group {
  margin-bottom: 28px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 14px;
}

.section-header h2 {
  margin: 0;
  font-size: 1.3rem;
}

.cards-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 18px;
}

.track-card,
.playlist-card {
  border: none;
  background: rgba(255,255,255,0.025);
  padding: 14px;
  border-radius: 16px;
  color: white;
  display: flex;
  flex-direction: column;
  gap: 8px;
  text-align: left;
}

.cover {
  width: 100%;
  aspect-ratio: 1;
  border-radius: 16px;
  background: linear-gradient(135deg, #4f46e5, #7c3aed, #ec4899);
  box-shadow: 0 10px 30px rgba(0,0,0,0.3);
}

.cover.alt {
  background: linear-gradient(135deg, #fbbf24, #f97316, #ef4444);
}

.track-card strong,
.playlist-card strong {
  font-size: 1rem;
}

.track-card span,
.playlist-card span {
  color: #b4b4b4;
  font-size: 0.8rem;
}

.track-table {
  display: grid;
  gap: 10px;
}

.track-row {
  display: grid;
  grid-template-columns: 40px minmax(180px, 2fr) minmax(120px, 1fr) minmax(100px, 1fr) 60px;
  gap: 12px;
  padding: 12px 14px;
  border-radius: 12px;
  background: rgba(255,255,255,0.02);
  align-items: center;
}

.track-row:hover {
  background: rgba(255,255,255,0.05);
}

.song-title {
  display: flex;
  align-items: center;
  gap: 12px;
}

.tiny-cover {
  width: 42px;
  height: 42px;
  border-radius: 10px;
  background: linear-gradient(135deg, #22c55e, #0ea5e9);
  flex-shrink: 0;
}

.song-title strong,
.song-title small {
  display: block;
}

.song-title small {
  color: #a5a5a5;
}

.index,
.track-row span {
  color: #d6d6d6;
}

.loading-state {
  color: #d9d9d9;
}

.player-bar {
  grid-column: 1 / -1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  background: rgba(24,24,24,0.95);
  border-top: 1px solid rgba(255,255,255,0.06);
  padding: 14px 26px;
}

.current-track {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 220px;
}

.current-track strong,
.current-track small {
  display: block;
}

.current-track small {
  color: #aaa;
}

.controls {
  display: flex;
  align-items: center;
  gap: 12px;
}

.control-btn {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  border: none;
  background: rgba(255,255,255,0.08);
  color: white;
}

.control-btn.primary {
  width: 46px;
  height: 46px;
  background: white;
  color: black;
}

.volume {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 170px;
  color: #ddd;
}

.volume-bar {
  width: 100%;
  height: 6px;
  background: rgba(255,255,255,0.12);
  border-radius: 999px;
  overflow: hidden;
}

.volume-bar span {
  display: block;
  height: 100%;
  background: #1ed760;
  border-radius: inherit;
}

@media (max-width: 900px) {
  .app-shell {
    grid-template-columns: 1fr;
    grid-template-rows: auto 1fr 90px;
  }

  .sidebar {
    border-right: none;
    border-bottom: 1px solid rgba(255,255,255,0.05);
  }

  .content {
    grid-column: 1;
    padding: 18px 16px 24px;
  }

  .player-bar {
    flex-wrap: wrap;
    justify-content: center;
  }

  .track-row {
    grid-template-columns: 40px minmax(0, 1fr) 1fr;
  }

  .track-row > :nth-child(3),
  .track-row > :nth-child(4),
  .track-row > :nth-child(5) {
    display: none;
  }
}
