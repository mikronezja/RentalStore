const mongoose = require('mongoose');
const {
    Product,
    RentalHistory
} = require('../models/index');

const rentProduct = async (req, res) => {
    const {productId, clientId, workerId, rentalTime = 14} = req.body;

    if (!productId || !clientId || !workerId) {
        return res.status(400).json({message: 'Wszystkie pola są wymagane'});
    }

    // transakcja
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        // upewiamy sie ze produkt istnieje i jest dostępny i od razu go zaklepujemy
        const product = await Product.findOneAndUpdate(
            {
                _id: productId,
                status: 'available'
            },
            {
                status: 'rented'
            },
            {
                new: true,
                session,
                runValidators: true
            }
        );


        if (!product) {
            await session.abortTransaction();
            session.endSession();
            return res.status(400).json({message: 'Produkt nie jest dostępny do wypożyczenia'});
        }

        const conditionBefore = product.condition;

        const rentalPeriod = {
            start: new Date(),
            end: new Date(new Date().setDate(new Date().getDate() + rentalTime))
        };

        const rentalHistory = new RentalHistory({
            product: productId,
            client: clientId,
            worker: workerId,
            rentalPeriod,
            status: 'rented',
            conditionBefore,
            priceCharged: req.body.priceCharged || 0, // Dodanie brakującego pola
            notes: req.body.notes || ''
        });

        await rentalHistory.save({session});

        // Zatwierdzenie transakcji
        await session.commitTransaction();
        session.endSession();

        res.status(201).json({
            message: 'Produkt został pomyślnie wypożyczony',
            rental: rentalHistory
        });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        res.status(500).json({message: 'Błąd podczas wypożyczania produktu', error: error.message});
    }
};

// zwrot produktu
const returnProduct = async (req, res) => {
    const {rentalId, conditionAfter} = req.body;

    if (!rentalId || !conditionAfter) {
        return res.status(400).json({message: 'Wszystkie pola są wymagane'});
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const rental = await RentalHistory.findById(rentalId).session(session);

        if (!rental || rental.status !== 'rented') {
            await session.abortTransaction();
            session.endSession();
            return res.status(400).json({message: 'Nieprawidłowy identyfikator wypożyczenia lub produkt nie jest wypożyczony'});
        }

        // Aktualizacja statusu produktu
        const product = await Product.findByIdAndUpdate(
            rental.product,
            {
                status: 'available',
                condition: conditionAfter
            },
            {new: true, session}
        );

        if (!product) {
            await session.abortTransaction();
            session.endSession();
            return res.status(400).json({message: 'Produkt nie został znaleziony'});
        }

        rental.status = 'returned';
        rental.conditionAfter = conditionAfter;
        await rental.save({session});
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        return res.status(500).json({message: 'Błąd podczas zwrotu produktu', error: error.message});
    }
}

module.exports = {
    rentProduct,
    returnProduct
}