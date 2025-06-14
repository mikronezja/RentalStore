const express = require('express');
const router = express.Router();

const {
    getAllProducts,
    getProductById,
    getProductsByCategory,
    getProductsByStatus,
    createProduct,
    updateProduct,
    deleteProduct,
    getMostPopularProducts
} = require('../controllers/productsController');

router.route('/popular').get(getMostPopularProducts);
router.route('/category/:category').get(getProductsByCategory);
router.route('/status/:status').get(getProductsByStatus);

router.route('/')
    .get(getAllProducts)
    .post(createProduct);

router.route('/product/:id')
    .get(getProductById)
    .put(updateProduct)
    .delete(deleteProduct);

module.exports = router;