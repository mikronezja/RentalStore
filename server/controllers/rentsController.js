const mongoose = require('mongoose');
const {
    Product,
    RentalHistory
} = require('../models/index');


const getAllRents = async (req, res) => {
    const {limit = 10, page = 1} = req.query;
    try {
        const rents = await RentalHistory.find({})
            .populate({ path: 'product', select: 'title' })
            .populate({ path: 'client', select: 'firstName lastName' })
            .populate({ path: 'worker', select: 'name' }) // Założenie, że model Worker ma pole 'name'
            .skip(page > 0 ? (page - 1) * limit : 0)
            .limit(parseInt(limit))
            .sort({createdAt: -1});
        res.status(200).json(rents);
    } catch (error) {
        res.status(500).json({message: 'Błąd podczas pobierania wypożyczeń', error: error.message});
    }
}

// Pobieranie wypożyczenia po ID
const getRentalById = async (req, res) => {
    const {id} = req.params;

    try {
        const rental = await RentalHistory.findById(id)
            .populate('product')
            .populate('client')
            .populate('worker');

        if (!rental) {
            return res.status(404).json({message: 'Wypożyczenie nie zostało znalezione'});
        }

        res.status(200).json(rental);
    } catch (error) {
        res.status(500).json({message: 'Błąd podczas pobierania wypożyczenia', error: error.message});
    }
};

// Pobieranie aktywnych wypożyczeń
const getActiveRents = async (req, res) => {
    const {limit = 10, page = 1} = req.query;

    try {
        const activeRents = await RentalHistory.find({status: 'rented'})
            .populate('product client worker')
            .skip(page > 0 ? (page - 1) * limit : 0)
            .limit(parseInt(limit))
            .sort({'rentalPeriod.end': 1});

        const total = await RentalHistory.countDocuments({status: 'rented'});

        res.status(200).json({
            rents: activeRents,
            total,
            currentPage: parseInt(page),
            totalPages: Math.ceil(total / limit)
        });
    } catch (error) {
        res.status(500).json({message: 'Błąd podczas pobierania aktywnych wypożyczeń', error: error.message});
    }
};

// Pobieranie wypożyczeń przeterminowanych
const getOverdueRents = async (req, res) => {
    const {limit = 10, page = 1} = req.query;
    const currentDate = new Date();

    try {
        const overdueRents = await RentalHistory.find({
            status: 'rented',
            'rentalPeriod.end': {$lt: currentDate}
        })
            .populate('product client worker')
            .skip(page > 0 ? (page - 1) * limit : 0)
            .limit(parseInt(limit))
            .sort({'rentalPeriod.end': 1});

        const total = await RentalHistory.countDocuments({
            status: 'rented',
            'rentalPeriod.end': {$lt: currentDate}
        });

        res.status(200).json({
            rents: overdueRents,
            total,
            currentPage: parseInt(page),
            totalPages: Math.ceil(total / limit)
        });
    } catch (error) {
        res.status(500).json({message: 'Błąd podczas pobierania przeterminowanych wypożyczeń', error: error.message});
    }
};

// Pobieranie wypożyczeń dla konkretnego klienta
const getClientRentals = async (req, res) => {
    const {clientId} = req.params;
    const {limit = 10, page = 1, status} = req.query;

    const query = {client: clientId};

    if (status) {
        query.status = status;
    }

    try {
        const rentals = await RentalHistory.find(query)
            .populate('product worker')
            .skip(page > 0 ? (page - 1) * limit : 0)
            .limit(parseInt(limit))
            .sort({createdAt: -1});

        const total = await RentalHistory.countDocuments(query);

        res.status(200).json({
            rentals,
            total,
            currentPage: parseInt(page),
            totalPages: Math.ceil(total / limit)
        });
    } catch (error) {
        res.status(500).json({message: 'Błąd podczas pobierania wypożyczeń klienta', error: error.message});
    }
};

// Anulowanie wypożyczenia
const cancelRental = async (req, res) => {
    const {rentalId} = req.params;
    const {cancelReason} = req.body;

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const rental = await RentalHistory.findById(rentalId).session(session);

        if (!rental || rental.status !== 'rented') {
            await session.abortTransaction();
            session.endSession();
            return res.status(400).json({message: 'Wypożyczenie nie istnieje lub nie można go anulować'});
        }

        // Aktualizuj status produktu
        await Product.findByIdAndUpdate(
            rental.product,
            {status: 'available'},
            {session}
        );

        // Aktualizuj wypożyczenie
        rental.status = 'cancelled';
        rental.notes = rental.notes ? `${rental.notes}\nAnulowano: ${cancelReason}` : `Anulowano: ${cancelReason}`;
        rental.rentalPeriod.returned = new Date();
        await rental.save({session});

        await session.commitTransaction();
        session.endSession();

        res.status(200).json({
            message: 'Wypożyczenie zostało anulowane',
            rental
        });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        res.status(500).json({message: 'Błąd podczas anulowania wypożyczenia', error: error.message});
    }
};

// Zgłoszenie uszkodzonego produktu
const reportDamagedProduct = async (req, res) => {
    const {rentalId} = req.params;
    const {damageDescription} = req.body;

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const rental = await RentalHistory.findById(rentalId).session(session);

        if (!rental || rental.status !== 'rented') {
            await session.abortTransaction();
            session.endSession();
            return res.status(400).json({message: 'Wypożyczenie nie istnieje lub produkt nie jest wypożyczony'});
        }

        // Aktualizuj status produktu
        await Product.findByIdAndUpdate(
            rental.product,
            {
                status: 'damaged',
                condition: 'damaged'
            },
            {session}
        );

        // Aktualizuj wypożyczenie
        rental.status = 'damaged';
        rental.conditionAfter = 'damaged';
        rental.notes = rental.notes ? `${rental.notes}\nUszkodzenie: ${damageDescription}` : `Uszkodzenie: ${damageDescription}`;
        rental.rentalPeriod.returned = new Date();
        await rental.save({session});

        await session.commitTransaction();
        session.endSession();

        res.status(200).json({
            message: 'Zgłoszenie uszkodzenia zostało zapisane',
            rental
        });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        res.status(500).json({message: 'Błąd podczas zgłaszania uszkodzenia', error: error.message});
    }
};

const rentProduct = async (req, res) => {
    const {productId, client, worker, rentalTime = 14} = req.body;

    if (!productId || !client || !worker) {
        return res.status(400).json({message: 'Wszystkie pola są wymagane'});
    }

    // transakcja
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        // Znajdź klienta po ID lub email
        let clientDoc;
        if (mongoose.Types.ObjectId.isValid(client)) {
            clientDoc = await Client.findById(client).session(session);
        } else {
            clientDoc = await Client.findOne({ email: client }).session(session);
        }

        if (!clientDoc) {
            await session.abortTransaction();
            session.endSession();
            return res.status(404).json({message: 'Nie znaleziono klienta'});
        }

        // Znajdź pracownika po ID lub email
        let workerDoc;
        if (mongoose.Types.ObjectId.isValid(worker)) {
            workerDoc = await Worker.findById(worker).session(session);
        } else {
            workerDoc = await Worker.findOne({ email: worker }).session(session);
        }

        if (!workerDoc) {
            await session.abortTransaction();
            session.endSession();
            return res.status(404).json({message: 'Nie znaleziono pracownika'});
        }

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
            client: clientDoc._id,
            worker: workerDoc._id,
            rentalPeriod,
            status: 'rented',
            conditionBefore,
            priceCharged: req.body.priceCharged || 0,
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
    const { rentalId } = req.params;
    let { conditionAfter } = req.body;

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const rental = await RentalHistory.findOne({
            _id: rentalId,
            status: 'rented'
        }).session(session);

        if (!rental) {
            await session.abortTransaction();
            session.endSession();
            return res.status(404).json({message: 'Nie znaleziono aktywnego wypożyczenia o podanym ID'});
        }

        const productId = rental.product;
        conditionAfter = conditionAfter || rental.conditionBefore;

        await Product.findByIdAndUpdate(
            productId,
            { status: 'available', condition: conditionAfter },
            { new: true, session }
        );

        rental.status = 'returned';
        rental.conditionAfter = conditionAfter;
        rental.rentalPeriod.returned = new Date();
        await rental.save({session});

        await session.commitTransaction();
        session.endSession();

        return res.status(200).json({
            message: 'Produkt został pomyślnie zwrócony',
            rental: rental
        });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        return res.status(500).json({message: 'Błąd podczas zwrotu produktu', error: error.message});
    }
};
module.exports = {
    rentProduct,
    returnProduct,
    getAllRents,
    getRentalById,
    getActiveRents,
    getOverdueRents,
    getClientRentals,
    cancelRental,
    reportDamagedProduct
}