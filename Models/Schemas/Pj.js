const mongoose = require('mongoose');
const {Schema} = mongoose;

const schema = new Schema({
    nama: {
        type: String,
        required: true,
    },
    nik: String,
    kelamin: String,
    hubungan: String,
    alamat: String,
    telp: String,
    pekerjaan: String,
    pendidikan: String,
    wali: String,
    telpWali: String
});

module.exports = schema;
