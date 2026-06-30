# Musify — Music Streaming Platform

A full-stack music streaming web application built with the MERN stack. Users can upload songs, create playlists, follow artists, stream music, and discover new tracks.

---

## Tech Stack

### Backend
- **Runtime:** Node.js + Express 5
- **Database:** MongoDB + Mongoose 9
- **Auth:** JWT (access + refresh tokens) + bcryptjs
- **File Storage:** Cloudinary (audio + images)
- **Validation:** JOI
- **Rate Limiting:** express-rate-limit
- **Email:** Nodemailer

### Frontend
- **Framework:** React 18 + Vite
- **Routing:** React Router v6
- **Styling:** Tailwind CSS v4 (dark/light theme)
- **State:** Redux Toolkit + RTK Query
- **Audio:** Howler.js
- **Forms:** React Hook Form + Zod
- **Icons:** Lucide React

---

## Features

### Core
- User registration & login with JWT (access + refresh tokens)
- Role-based access: user, artist, admin
- Song upload with audio + cover image (Cloudinary)
- Album & playlist management
- Like/unlike songs
- Follow/unfollow artists
- Song streaming via byte-range proxy
- Real-time play count tracking

### Search & Discovery
- Search by song title, artist name, or genre
- Genre filter chips
- iTunes Store integration (30s previews)
- Trending charts, top liked, new releases
- Activity feed from followed artists

### Player
- Global bottom player bar with play/pause, next/prev
- Queue management with reorder
- Shuffle & repeat modes
- Progress bar with seek
- Volume control
- Sleep timer (5-60 minutes)
- 10-band equalizer with presets
- Lyrics display panel

### Social
- Like songs (heart icon)
- Follow/unfollow artists
- Notifications (likes, comments, follows)
- Comments on songs
- Share songs (copy link, WhatsApp, Twitter)

### Library
- Playlists with cover images
- Liked songs collection
- Listening history with clear option
- Add songs to playlists from any song card

### Admin Dashboard
- User management (role change, delete)
- Song management (delete any song)
- Platform stats (users, songs, albums, plays)

### UI/UX
- Dark/light theme toggle
- Responsive sidebar with playlist list
- Back/forward navigation arrows
- Email verification banner
- Skeleton loading states
- Smooth transitions & hover effects

---

## Project Structure

```
Music-backend/
├── server/
│   ├── config/db.js, cloudinary.js
│   ├── middleware/authMiddleware.js, uploadMiddleware.js, validate.js, rateLimiter.js
│   ├── models/User.js, Song.js, Album.js, Playlist.js, Comment.js, Notification.js, History.js, RefreshToken
│   ├── controllers/authController.js, songController.js, albumController.js, playlistController.js, userController.js, commentController.js, notificationController.js, adminController.js, historyController.js, chartsController.js, externalController.js
│   ├── routes/auth.js, songs.js, albums.js, playlists.js, users.js, comments.js, notifications.js, admin.js, history.js, charts.js, external.js
│   ├── validations/authValidation.js, songValidation.js, albumValidation.js, playlistValidation.js, userValidation.js, commentValidation.js
│   ├── utils/asyncHandler.js, sendEmail.js
│   ├── .env
│   └── server.js

Music-frontend/
├── src/
│   ├── app/store.js
│   ├── api/authApi.js, songsApi.js, albumsApi.js, playlistsApi.js, usersApi.js, commentsApi.js, notificationsApi.js, adminApi.js, historyApi.js, chartsApi.js, externalApi.js, baseQuery.js
│   ├── features/auth/authSlice.js, player/playerSlice.js
│   ├── context/ThemeContext.jsx
│   ├── components/layout/Layout.jsx, Sidebar.jsx, Navbar.jsx
│   ├── components/player/Player.jsx, PlayerControls.jsx, ProgressBar.jsx, VolumeControl.jsx, QueuePanel.jsx, SleepTimer.jsx, Equalizer.jsx
│   ├── components/lyrics/LyricsPanel.jsx
│   ├── components/cards/SongCard.jsx, AlbumCard.jsx, PlaylistCard.jsx
│   ├── components/comments/CommentSection.jsx
│   ├── components/ui/Button.jsx, Input.jsx, Modal.jsx, Spinner.jsx, CreatePlaylistModal.jsx, AddToPlaylistModal.jsx, ShareModal.jsx
│   ├── components/guards/PrivateRoute.jsx, ArtistRoute.jsx, AdminRoute.jsx
│   ├── pages/Home.jsx, Search.jsx, Library.jsx, AlbumPage.jsx, PlaylistPage.jsx, ArtistPage.jsx, Upload.jsx, Login.jsx, Register.jsx, ForgotPassword.jsx, ResetPassword.jsx, VerifyEmail.jsx, Feed.jsx, Charts.jsx, admin/AdminDashboard.jsx, admin/AdminUsers.jsx, admin/AdminSongs.jsx
│   ├── hooks/usePlayer.js, useAuthRecovery.js
│   ├── utils/formatTime.js, tokenStorage.js
│   ├── App.jsx, main.jsx, index.css
│   └── .env
```

---


## Setup

### Backend
```bash
cd Music-backend
npm install
# Update server/.env with your credentials
npm start
```

### Frontend
```bash
cd Music-frontend
npm install
npm run dev
```

### Environment Variables

**Backend (`server/.env`)**
```
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/Music
JWT_SECRET=your_secret
JWT_EXPIRES_IN=15m
JWT_REFRESH_SECRET=your_refresh_secret
JWT_REFRESH_EXPIRES_IN=30d
CLOUDINARY_CLOUD_NAME=your_cloud
CLOUDINARY_API_KEY=your_key
CLOUDINARY_API_SECRET=your_secret
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_gmail
EMAIL_PASS=your_app_password
EMAIL_FROM=Musify <your_gmail>
```

**Frontend (`.env`)**
```
VITE_API_URL=http://localhost:5000/api
```

---

## Test Credentials

| User | Email | Password | Role |
|------|-------|----------|------|
| ArijitSingh | arijit@test.com | pass123 | artist |
| Badshah | badshah@test.com | pass123 | artist |
| EdSheeran | ed@test.com | pass123 | artist |
| TheWeeknd | weeknd@test.com | pass123 | artist |
| alice | alice@test.com | pass123 | user |
| bob | bob@test.com | pass456 | user |

---

## Database Seed

48 songs across 9 genres (Hindi, English, Punjabi, Gujarati, Tamil, Marathi, Bhojpuri, Bengali, Marwadi), 8 albums, 16 playlists, 11 users.

---

## Build Order (what was built)

1. Backend API (28 endpoints) with JWT auth, Cloudinary uploads
2. JOI validation, rate limiting, email (password reset + verification)
3. Comments, notifications, activity feed, admin dashboard
4. Song streaming (byte-range), iTunes integration, charts
5. Frontend with Vite + React + Tailwind + Redux Toolkit
6. Dark/light theme, Spotify-like UI
7. Audio player with Howler.js, queue, equalizer, sleep timer
8. Search with artist filter, library with liked songs + history
9. Share modal, download, collaborative playlist structure
