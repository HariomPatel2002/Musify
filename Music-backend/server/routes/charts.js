const express = require('express');
const { getCharts } = require('../controllers/chartsController');

const router = express.Router();

router.get('/', getCharts);

module.exports = router;
