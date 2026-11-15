const express = require('express');
const router = express.Router();
const {
  getTheatres,
  getTheatreById,
  getCities,
} = require('../controllers/theatreController');

router.get('/', getTheatres);
router.get('/cities', getCities);
router.get('/:id', getTheatreById);

module.exports = router;
