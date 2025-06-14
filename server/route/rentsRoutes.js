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

// Podstawowe trasy
router.route('/').get(getAllRents);
router.route('/rent/:id').get(getRentalById);

// Funkcje wypożyczania i zwrotu
router.route('/rent').post(rentProduct);
router.route('/return').post(returnProduct);

// Specjalne zapytania
router.route('/active').get(getActiveRents);
router.route('/overdue').get(getOverdueRents);
router.route('/client/:clientId').get(getClientRentals);

// Operacje na wypożyczeniach
router.route('/:rentalId/cancel').post(cancelRental);
router.route('/:rentalId/damage').post(reportDamagedProduct);

module.exports = router;