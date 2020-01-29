const mongoose = require('mongoose');
const {Schema} = mongoose;

const schema = new Schema({
    rm: {
        type: String,
        required: true,
    },
    nama: {
        type: String,
        required: true,
    },
    nik: String,
    kelamin: String,
    ttl: String,
    kebangsaan: String,
    alamat: String,
    telp: String,
    agama: String,
    perkawinan: String,
    pekerjaan: String,
    pendidikan: String
});

module.exports = schema;
