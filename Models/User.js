const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        unique: true,
        minlength: 6,
        trim: true
    },
    nama: {
        type: String,
        required: true,
        minlength: 6,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true
    },
    pin: {
        type: String,
        required: true,
    },
    type: {
        type: Number,
        default: 0
    },
    token: {
        type: String,
    }
})

module.exports = schema;
