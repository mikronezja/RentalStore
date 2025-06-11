const mongoose = require('mongoose');

const rentalHistorySchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
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
    rentalPeriod: {
        start: {
            type: Date,
            required: true
        },
        end: {
            type: Date,
            required: true
        },
        returned: {
            type: Date,
            default: null
        }
    },
    status: {
        type: String,
        required: true,
        enum: ['rented', 'completed', 'overdue', 'damaged', 'lost', 'cancelled'],
        default: 'rented'
    },
    notes: {
        type: String,
        trim: true
    },
    conditionBefore: {
        type: String,
        enum: ['new', 'good', 'fair', 'poor'],
        required: true
    },
    conditionAfter: {
        type: String,
        enum: ['new', 'good', 'fair', 'poor', 'damaged'],
        default: null
    }
}, {timestamps: true});

module.exports = mongoose.model('RentalHistory', rentalHistorySchema);