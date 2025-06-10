const mongoose = require('mongoose');

const workerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    phone: {
        type: String,
        required: true,
        trim: true
    },
    position: {
        type: String,
        required: true,
        enum: ['manager', 'casual'], // manager moze np dodawac produkty i przegladac zamowienia
        default: 'casual'
    }
}, {timestamps: true});

module.exports = mongoose.model('Worker', workerSchema);