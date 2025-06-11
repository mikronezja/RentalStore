const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    category: {
        type: String,
        required: true,
        trim: true
    },
    type: {
        type: String,
        required: true,
        enum: ['movie', 'audiobook', 'book', 'music', 'game'],
        default: 'movie'
    },
    status: {
        type: String,
        required: true,
        enum: ['available', 'rented', 'reserved', 'damaged', 'maintenance'],
        default: 'available'
    },
    condition: {
        type: String,
        required: true,
        enum: ['new', 'good', 'fair', 'poor', 'damaged'],
        default: 'new'
    },
    reviews: [{
        clientId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Client',
            required: true
        },
        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5
        },
        comment: {
            type: String,
            trim: true
        },
        date: {
            type: Date,
            default: Date.now
        }
    }],
}, {timestamps: true})

module.exports = mongoose.model('Product', productSchema);