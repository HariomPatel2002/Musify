const express = require('express');
const { searchExternal } = require('../controllers/externalController');

const router = express.Router();

router.get('/search', searchExternal);

module.exports = router;
