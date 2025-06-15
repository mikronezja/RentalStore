const mongoose = require('mongoose');
const {
    Product,
    RentalHistory,
    Client
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
            {$match: {status: 'rented'}},
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
    const { id } = req.params;
    const { title, description, category, type, status, condition } = req.body;

    try {
        const updatedProduct = await Product.findByIdAndUpdate(id, {
            title,
            description,
            category,
            type,
            status,
            condition
        }, { new: true, runValidators: true });

        if (!updatedProduct) {
            return res.status(404).json({ message: 'Produkt nie został znaleziony' });
        }

        res.status(200).json(updatedProduct);
    } catch (error) {
        res.status(500).json({ message: 'Błąd podczas aktualizacji produktu', error: error.message });
    }
}

const deleteProduct = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedProduct = await Product.findByIdAndDelete(id);

        if (!deletedProduct) {
            return res.status(404).json({ message: 'Produkt nie został znaleziony' });
        }

        res.status(200).json({ message: 'Produkt został pomyślnie usunięty', id });
    } catch (error) {
        res.status(500).json({ message: 'Błąd podczas usuwania produktu', error: error.message });
    }
}

const getProductsByCategory = async (req, res) => {
    const { category } = req.params;
    const { limit = 10, page = 1 } = req.query;

    try {
        const products = await Product.find({ category })
            .skip(page > 0 ? (page - 1) * limit : 0)
            .limit(parseInt(limit))
            .sort({ createdAt: -1 });

        const total = await Product.countDocuments({ category });

        res.status(200).json({
            products,
            total,
            currentPage: parseInt(page),
            totalPages: Math.ceil(total / limit)
        });
    } catch (error) {
        res.status(500).json({ message: 'Błąd podczas pobierania produktów według kategorii', error: error.message });
    }
}

const getProductsByStatus = async (req, res) => {
    const { status } = req.params;
    const { limit = 10, page = 1 } = req.query;

    try {
        const products = await Product.find({ status })
            .skip(page > 0 ? (page - 1) * limit : 0)
            .limit(parseInt(limit))
            .sort({ createdAt: -1 });

        const total = await Product.countDocuments({ status });

        res.status(200).json({
            products,
            total,
            currentPage: parseInt(page),
            totalPages: Math.ceil(total / limit)
        });
    } catch (error) {
        res.status(500).json({ message: 'Błąd podczas pobierania produktów według statusu', error: error.message });
    }
}

// Dodawanie opinii dla produktu
const addProductReview = async (req, res) => {
    const { id } = req.params;
    const { username, rating, comment } = req.body;


    // Sprawdzenie poprawności danych wejściowych
    if (!username || !rating) {
        return res.status(400).json({ message: 'Wymagane pola: klient (ID lub email) i ocena' });
    }

    // Sprawdzenie czy ocena jest prawidłowa (zakres 1-5)
    if (rating < 1 || rating > 5) {
        return res.status(400).json({ message: 'Ocena musi być w zakresie od 1 do 5' });
    }

    // Rozpoczęcie transakcji
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        // Identyfikacja klienta na podstawie ID lub adresu email
        let clientDoc;

        if (mongoose.Types.ObjectId.isValid(username)) {
            clientDoc = await Client.findById(username).session(session);
        } else {
            clientDoc = await Client.findOne({ email: username }).session(session);
        }

        if (!clientDoc) {
            await session.abortTransaction();
            session.endSession();
            return res.status(404).json({ message: 'Nie znaleziono klienta' });
        }

        const clientId = clientDoc._id;

        // Sprawdzamy, czy produkt istnieje
        const product = await Product.findById(id).session(session);

        if (!product) {
            await session.abortTransaction();
            session.endSession();
            return res.status(404).json({ message: 'Produkt nie został znaleziony' });
        }

        // Dodajemy nową opinię - używamy nazwy pola zgodnej ze schematem (clientId zamiast client)
        const newReview = {
            clientId: clientId, // Zmieniono z client na clientId zgodnie ze schematem
            rating,
            comment: comment || '',
        };

        // Aktualizacja produktu bez walidacji (aby obejść problem ze schematem)
        product.reviews.push(newReview);

        // Aktualizacja średniej oceny
        // const totalRating = product.reviews.reduce((sum, review) => sum + review.rating, 0);
        // product.avgRating = Number((totalRating / product.reviews.length).toFixed(1));

        await product.save({ session });

        // Zatwierdzenie transakcji
        await session.commitTransaction();
        session.endSession();

        res.status(201).json({
            message: 'Opinia została dodana pomyślnie',
            review: newReview
        });
    } catch (error) {
        // W przypadku błędu wycofujemy transakcję
        await session.abortTransaction();
        session.endSession();
        res.status(500).json({ message: 'Błąd podczas dodawania opinii', error: error.message });
    }
}

module.exports = {
    getAllProducts,
    getMostPopularProducts,
    getProductById,
    getProductsByCategory,
    getProductsByStatus,
    createProduct,
    updateProduct,
    deleteProduct,
    addProductReview
}