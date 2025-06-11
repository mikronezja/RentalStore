const express = require('express');
const router = express.Router();

const {
    rentProduct,
    returnProduct,
} = require('../controllers/productsController');

router.route('/rent').post(rentProduct);
router.route('/return').post(returnProduct);

module.exports = router;