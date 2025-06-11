const {
    Product,
    Order
} = require('../models/index');

// to be written ... 
const addProductToOrder = async (req, res) => 
{
    
}

// to be written ...
const orderProducts = async (req, res) => {

}

const returnOrderProduct = async (req, res) => {
    const {id} = req.params;

    if (!id) 
    {
        return res.status(400).json({message: 'All fields are required'});
    }

    try {
        const order = await Order.findById(id).populate('products.product');

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        const productIds = order.products.map(item => item.product._id);
        
        await Product.updateMany(
            { _id: { $in: productIds } },
            { reserved: false }
        );
        const allProductsReturned = await checkAllProductsReturned(order.products);

        const orderUpdate = {
            'rentalPeriod.returned': new Date()
        };

        if (allProductsReturned) {
            orderUpdate.status = 'returned';
        }

        const updatedOrder = await Order.findByIdAndUpdate(
            id,
            orderUpdate,
            { new: true }
        ).populate('products.product');

        res.status(200).json({
            message: 'Products returned successfully',
            order: updatedOrder
        });
    } catch (error) {
        res.status(500).json({message: 'Error updating product', error: error.message});
    }

}

const checkAllProductsReturned = async (orderProducts) =>
{
    try
    {
        const productIds = orderProducts.map(item => item.product._id);
        const products = await Product.find({ _id: { $in: productIds } });
        return products.every(product => !product.reserved);
    }
    catch (error)
    {
        console.error('Error checking product status:', error);
        return false;
    }
}

module.exports = {
    returnOrderProduct
}