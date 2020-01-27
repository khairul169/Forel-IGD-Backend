const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    rm: {
        type: String,
        required: true,
    },
    nama: {
        type: String,
        required: true,
    },
    nik: {
        type: String,
    },
    kelamin: {
        type: Number,
    },
    ttl: {
        type: String,
    },
    kebangsaan: {
        type: Number,
    },
    alamat: {
        type: String,
    },
    telp: {
        type: String,
    },
    agama: {
        type: Number,
    },
    perkawinan: {
        type: Number,
    },
    pekerjaan: {
        type: Number,
    },
    pendidikan: {
        type: Number,
    }
})

const Model = mongoose.model('Pasien', schema);

module.exports = Model;
