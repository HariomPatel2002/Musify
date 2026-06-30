const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./config/db');
const { globalLimiter } = require('./middleware/rateLimiter');

dotenv.config({ path: './server/.env' });

connectDB();

const app = express();

app.use(cors({
  origin: (origin, callback) => {
    const allowed = ['http://localhost:3000', 'http://127.0.0.1:3000'];
    if (!origin || allowed.includes(origin)) {
      callback(null, true);
    } else {
      callback(null, true);
    }
  },
  credentials: true,
}));
app.use(morgan('dev'));
app.use(express.json());
app.use(globalLimiter);

app.use('/api/auth', require('./routes/auth'));
app.use('/api/songs', require('./routes/songs'));
app.use('/api/albums', require('./routes/albums'));
app.use('/api/playlists', require('./routes/playlists'));
app.use('/api/users', require('./routes/users'));
app.use('/api/notifications', require('./routes/notifications'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/history', require('./routes/history'));
app.use('/api/charts', require('./routes/charts'));
app.use('/api/external', require('./routes/external'));

const { commentRoutes } = require('./routes/comments');
app.use('/api/comments', commentRoutes);

app.get('/', (req, res) => {
  res.json({ success: true, message: 'Music Streaming API is running' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);

  if (err.name === 'MulterError') {
    return res.status(400).json({ success: false, message: `Upload error: ${err.message}` });
  }

  if (err.message && err.message.includes('Only')) {
    return res.status(400).json({ success: false, message: err.message });
  }

  if (err.status === 429) {
    return res.status(429).json({ success: false, message: err.message || 'Too many requests' });
  }

  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
