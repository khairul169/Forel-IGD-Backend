const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    nama: {
        type: String,
        required: true,
    },
    nik: String,
    kelamin: Number,
    hubungan: String,
    alamat: String,
    telp: String,
    pekerjaan: Number,
    pendidikan: Number,
    wali: String,
    telpWali: String
})

const Model = mongoose.model('PJPasien', schema);

module.exports = Model;
