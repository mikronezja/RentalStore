const {
    Product
} = require('../models/index');

// Get all products
const getAllProducts = async (req, res) => {
    const {limit = 10, page = 1, title} = req.query;
    const query = {};

    if (title) {
        query.title = { $regex: title, $options: 'i' };
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
    const {limit = 10} = req.query;
    try {
        const products = await Product.find().sort({reserved: -1}).limit(parseInt(limit));
        res.status(200).json(products);
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

    const {title, description, category, type, stock} = req.body;

    if (!title || !description || !category || !type || !stock) {
        return res.status(400).json({message: 'All fields are required'});
    }

    try {
        const newProduct = new Product({
            title,
            description,
            category,
            type,
            stock
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
