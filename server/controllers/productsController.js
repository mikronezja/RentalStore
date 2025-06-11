const {
    Product,
    RentalHistory
} = require('../models/index');

// Get all products
const getAllProducts = async (req, res) => {
    const {limit = 10, page = 1, title} = req.query;
    const query = {};

    if (title) {
        query.title = {$regex: title, $options: 'i'};
    }

    try {
        const products = await Product.find(query).skip(page > 0 ? (page - 1) * limit : 0).limit(parseInt(limit)).sort({createdAt: -1});
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({message: 'Error fetching products', error: error.message});
    }
}

// get most popular products
const getMostPopularProducts = async (req, res) => {
    const {limit = 3} = req.query;

    try {
        const popularProducts = await RentalHistory.aggregate([
            {$group: {_id: "$product", count: {$sum: 1}}},
            {$sort: {count: -1}},
            {$limit: parseInt(limit)},
            {
                $lookup: {
                    from: 'products',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'productDetails'
                }
            },
            {$unwind: '$productDetails'},
            {$replaceRoot: {newRoot: '$productDetails'}}
        ]);

        res.status(200).json(popularProducts);
    } catch (error) {
        res.status(500).json({message: 'Error fetching popular products', error: error.message});
    }

}

// Get a single product by ID
const getProductById = async (req, res) => {
    const {id} = req.params;
    try {
        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({message: 'Product not found'});
        }
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({message: 'Error fetching product', error: error.message});
    }
}


const createProduct = async (req, res) => {
    console.log(req.body)

    const { title, description, category, type, status = "available", condition = "new" } = req.body;

    if (!title || !description || !category || !type) {
        return res.status(400).json({ message: 'Wymagane pola: tytuł, opis, kategoria i typ' });
    }

    try {
        const newProduct = new Product({
            title,
            description,
            category,
            type,
            status,
            condition,
            reviews: []
        });

        await newProduct.save();
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(500).json({message: 'Error creating product', error: error.message});
    }
}
const updateProduct = async (req, res) => {
    const {id} = req.params;
    const {title, description, category, type, stock} = req.body;

    if (!title || !description || !category || !type || !stock) {
        return res.status(400).json({message: 'All fields are required'});
    }

    try {
        const updatedProduct = await Product.findByIdAndUpdate(id, {
            title,
            description,
            category,
            type,
            stock
        }, {new: true});

        if (!updatedProduct) {
            return res.status(404).json({message: 'Product not found'});
        }

        res.status(200).json(updatedProduct);
    } catch (error) {
        res.status(500).json({message: 'Error updating product', error: error.message});
    }
}


module.exports = {
    getAllProducts,
    getMostPopularProducts,
    getProductById,
    createProduct,
    updateProduct
}
