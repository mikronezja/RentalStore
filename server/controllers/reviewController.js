const {
    Product,
    Client,
    RentalHistory
} = require('../models/index');

const addReview = async (req, res) => {
    const {clientId, productId, rating, comment} = req.body

    // transakcja
    const session = await mongoose.startSession();
    session.startTransaction();
    
    try 
    {
        if (!productId || !clientId || !rating) 
        {
            await session.abortTransaction();
            session.endSession();
            res.status(400).json({message: 'productId, userId i rating sa wymagane'});
        }   

        // nalezy sprawdzic czy klient zamowil
        const rental = await RentalHistory.findOne( 
        {
            client: clientId, 
            product : productId 
        });

        if (!rental)
        {
            await session.abortTransaction();
            session.endSession();
            res.status(400).json({message: 'Ten uzytkownik nie zamowil produktu'});
        }

        const review = {
            clientId : clientId,
            rating : rating, 
            comment: comment || "",
            date: Date.now(),
        }

        await Product.updateOne( 
            { _id : productId }, 
            { $push : review }
        );

        await Product.save({session});
        await session.abortTransaction();
        session.endSession();

        res.status(200).json({
            message : 'Opinia została dodana', 
            review : review
        });
    }
    catch (error)
    {
         res.status(500).json({message: 'Error adding opinion', error: error.message});
    }

}

module.exports = { 
    addReview
}