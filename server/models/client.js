const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({
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
    address: {
        street: {
            type: String,
            trim: true
        },
        city: {
            type: String,
            trim: true
        },
    },
    rank: {
        type: String,
        required: true,
        enum: ['bronze', 'silver', 'gold'], // zaleznie od rankingu klienta, ma wieksze rabaty, albo wiecej na raz moze wypozyczyc, zobaczymy
        default: 'bronze'
    },

}, {timestamps: true});

module.exports = mongoose.model('Client', clientSchema);