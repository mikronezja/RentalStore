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
    getMostPopularProducts,
    addProductReview
} = require('../controllers/productsController');
const { addReview } = require('../controllers/reviewController');

router.route('/popular').get(getMostPopularProducts);
router.route('/category/:category').get(getProductsByCategory);
router.route('/status/:status').get(getProductsByStatus);
router.route('/review/:id').post(addProductReview)

router.route('/')
    .get(getAllProducts)
    .post(createProduct);

router.route('/:id')
    .get(getProductById)
    .put(updateProduct)
    .delete(deleteProduct);

// router.route('/:productId/:clientId').post(addReview) // mozna przeniesc do osobnego controllera albo tu zostawic

module.exports = router;