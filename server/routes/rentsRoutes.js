const express = require('express');
const router = express.Router();

const {
    rentProduct,
    returnProduct,
    getAllRents,
    getRentalById,
    getActiveRents,
    getOverdueRents,
    getClientRentals,
    cancelRental,
    reportDamagedProduct
} = require('../controllers/rentsController');


router.route('/rent').post(rentProduct);
router.route('/return/:rentalId').post(returnProduct);

// Specjalne zapytania
router.route('/active').get(getActiveRents);
router.route('/overdue').get(getOverdueRents);
router.route('/client/:clientId').get(getClientRentals);

// Operacje na wypożyczeniach
router.route('/:rentalId/cancel').post(cancelRental);
router.route('/:rentalId/damage').post(reportDamagedProduct);

// Podstawowe trasy
router.route('/').get(getAllRents);
router.route('/:id').get(getRentalById);

module.exports = router;