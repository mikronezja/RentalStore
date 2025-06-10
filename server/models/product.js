const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    title:{
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
    stock: {
        type: Number,
        required: true,
        min: 0
    },
    reserved: {
        type: Number,
        default: 0,
        min: 0
    },
    reviews: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
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
        }
    }],
}, {timestamps: true})

module.exports = mongoose.model('Product', productSchema);