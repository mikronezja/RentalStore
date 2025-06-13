const express = require('express');
const router = express.Router();

const {
    rentProduct,
    returnProduct,
    getAllRents
} = require('../controllers/rentsController');

router.route('/rent').post(rentProduct);
router.route('/return').post(returnProduct);
router.route('/').get(getAllRents);

module.exports = router;