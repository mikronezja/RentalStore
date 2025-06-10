const express = require('express');
const router = express.Router();

const {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    getMostPopularProducts
} = require('../controllers/productsController');


router.route('/').get(getAllProducts).post(createProduct);
router.route('/:id').get(getProductById).put(updateProduct)
router.route('/popular').get(getMostPopularProducts);

module.exports = router;