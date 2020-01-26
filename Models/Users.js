const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        unique: true
    },
    nama: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    pin: {
        type: String,
        required: true
    },
    type: {
        type: Number,
        default: 0
    },
    token: {
        type: String,
    }
})

const Users = mongoose.model('Users', schema);

module.exports = Users;
