const {
    Product,
    Client,
    RentalHistory
} = require('../models/index');

const addReview = async (req, res) => {
    const {clientId, productId} = req.params;
    const {rating, comment} = req.body;

    const session = await mongoose.startSession();
    session.startTransaction();
    
    try {
        if (!productId || !clientId || !rating) {
            await session.abortTransaction();
            session.endSession();
            return res.status(400).json({message: 'productId, userId i rating sa wymagane'});
        }   

        // sprawdzenie czy klient zamowil produkt
        const rental = await RentalHistory.findOne({ 
            client: clientId, 
            product: productId 
        }).session(session);

        if (!rental) {
            await session.abortTransaction();
            session.endSession();
            return res.status(400).json({message: 'Ten uzytkownik nie zamowil produktu'});
        }

        const review = {
            clientId: clientId,
            rating: rating, 
            comment: comment || "",
            date: new Date(),
        };

        await Product.updateOne(
            { _id: productId }, 
            { $push: { reviews: review } },
            { session }
        );

        await session.commitTransaction();
        session.endSession();

        res.status(200).json({
            message: 'Opinia została dodana', 
            review: review
        });
    }
    catch (error) {
        await session.abortTransaction();
        session.endSession();
        res.status(500).json({message: 'Error adding opinion', error: error.message});
    }
};

module.exports = { 
    addReview
}