# KeySpotic

KeySpotic is a **background service** to control Spotify using **global hotkeys** on your system. It allows you to play, pause, skip tracks, and more without opening the Spotify app, using **customizable keyboard shortcuts**.

The project is **cross-platform** (Windows, Linux, macOS) and uses:

* **BunJS** for fast execution and multiplatform builds.
* **SQLite** to persist Spotify tokens and hotkey configuration.
* **node-global-key-listener** to capture global keyboard shortcuts.
* **Spotify Web API** to control playback.

---

## 🔧 Requirements

* **Bun** ≥ 1.2.x
  Installation: [https://bun.sh](https://bun.sh)

* **Node.js** (only if you run external scripts)

* **HTTPS**
  Spotify OAuth requires HTTPS. Place certificates in:

  ```
  certs/cert.pem
  certs/key.pem
  ```

  Bun will serve the callback endpoint on `https://localhost:<PORT>`.

* **Spotify Developer Account**
  Required to obtain `clientId`, `clientSecret`, and `redirectUri`.

---

## ⚙️ Setup

1. Clone the repository and enter the project:

```bash
git clone https://github.com/SammyBytes/KeySpotic
cd keyspotic
bun install
```

2. Configure environment variables:

```env
SPOTIFY_CLIENT_ID=your_client_id
SPOTIFY_CLIENT_SECRET=your_client_secret
SPOTIFY_REDIRECT_URI=https://localhost:54321/api/v1/spotify/callback
HONO_PORT=54321
```

> Note: The `redirectUri` must match the one registered in your Spotify Developer account.

3. Generate local certificates if needed:

```bash
mkdir certs
openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout certs/key.pem -out certs/cert.pem
```

---

## 🏗️ Project Structure

```
src/
├─ index.ts                  # Main service entry point
├─ listeners/                # Global hotkey listener
├─ modules/
│  ├─ spotify/
│  │  ├─ commands/           # Spotify actions (play/pause/next/prev)
│  │  ├─ config/             # Spotify config and DB
│  │  └─ auth/               # OAuth setup
│  │  └─ routes/             # Hono routes for OAuth callback
├─ hotkeys.json              # Configurable hotkeys
certs/                        # Local HTTPS certificates
spotify.db                   # SQLite DB with Spotify tokens
```

---

## 🚀 Usage

### Development Mode

```bash
bun run src/index.ts
```

This will:

1. Start the global hotkey listener.
2. Check if a Spotify token exists (`spotify.db`).
3. If no token exists, generate a Spotify authorization link.
4. Wait for HTTPS callback to save the token.

### Cross-platform Build

```bash
bun build src/index.ts --outdir dist --target bun
cp -r certs dist/certs
cp hotkeys.json dist/hotkeys.json
cp spotify.db dist/spotify.db
node dist/index.js
```

> This produces a build ready for end users. Everything runs from the `dist/` folder.

---

## 🎹 Hotkeys

* Configurable in `hotkeys.json`:

```json
[
  {
    "hotkey": "CTRL + ALT + P",
    "action": "playPause"
  },
  {
    "hotkey": "CTRL + ALT + RIGHT ARROW",
    "action": "nextTrack"
  },
  {
    "hotkey": "CTRL + ALT + LEFT ARROW",
    "action": "previousTrack"
  }
]
```

* You can add or modify hotkeys without rebuilding the project.

---

## ⚡ Spotify Commands

* `playPause()` → Play / Pause
* `nextTrack()` → Skip to next track
* `previousTrack()` → Previous track

---

## 🛠️ Main Dependencies

| Package                    | Purpose                      |
| -------------------------- | ---------------------------- |
| `bun:sqlite`               | Persist tokens and hotkeys   |
| `node-global-key-listener` | Capture global hotkeys       |
| `spotify-web-api-node`     | Interact with Spotify API    |
| `hono`                     | Handle OAuth callback routes |

---

## 📌 Tips

1. Delete `spotify.db` if you want to reauthorize Spotify.
2. `hotkeys.json` and certificates should be in the same folder as `dist/index.js` for distribution.
3. HTTPS is required for Spotify OAuth. Self-signed certificates work locally.
4. The hotkey listener runs in the background, even if Spotify is minimized.

---
