const axios = require('axios');
const asyncHandler = require('../utils/asyncHandler');

exports.searchExternal = asyncHandler(async (req, res) => {
  const { q, type = 'song' } = req.query;
  if (!q) return res.status(400).json({ success: false, message: 'Search query required' });

  const entity = type === 'artist' ? 'musicArtist' : type === 'album' ? 'album' : 'song';
  const url = `https://itunes.apple.com/search?term=${encodeURIComponent(q)}&entity=${entity}&limit=20`;

  const response = await axios.get(url);
  const results = response.data.results.map((r) => ({
    id: r.trackId || r.collectionId || r.artistId,
    title: r.trackName || r.collectionName || r.artistName,
    artist: r.artistName,
    album: r.collectionName || '',
    duration: r.trackTimeMillis ? r.trackTimeMillis / 1000 : 0,
    audioUrl: r.previewUrl || '',
    coverUrl: (r.artworkUrl100 || '').replace('100x100', '400x400'),
    source: 'itunes',
  }));

  res.json({ success: true, data: results });
});
