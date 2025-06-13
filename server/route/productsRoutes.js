const express = require('express');
const router = express.Router();

const {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    getMostPopularProducts
} = require('../controllers/productsController');


router.route('/popular').get(getMostPopularProducts);
router.route('/').get(getAllProducts).post(createProduct);
router.route('/product/:id').get(getProductById).put(updateProduct)

module.exports = router;