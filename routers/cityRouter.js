const express = require('express');
const router = express.Router();
const CityController = require('../controllers/cityController');

router.post('/init', CityController.initAllCity);
router.get('/', CityController.getAllCity);

router.get('/:name', CityController.getCityByName);
router.get('/:id', CityController.getCityByProvinceId);

module.exports = router