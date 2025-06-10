const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    client: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Client',
        required: true
    },
    worker: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Worker',
        required: true
    },
    products: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        },
        quantity: {
            type: Number,
            required: true,
            min: 1
        }

    }],
    totalAmount: {
        type: Number,
        required: true,
        min: 0
    },
    status: {
        type: String,
        required: true,
        enum: ['reserved', 'rented', 'returned', 'cancelled'],
        default: 'reserved'
    },
    rentalPeriod: {
        start: {
            type: Date,
            required: true
        },
        to: {
            type: Date,
            required: true
        },
        returned: {
            type: Date,
            default: null
        }
    }

} , {timestamps: true});

module.exports = mongoose.model('Order', orderSchema);