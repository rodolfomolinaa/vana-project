const express = require('express');
const router = express.Router();
const banguatController = require('../controllers/Banguat');

router.get('/date-currency', banguatController.getRateByDateAndCurrency);
router.get(
    '/date-range-currency',
    banguatController.getRateByRangeDateAndCurrency,
);

module.exports = router;
