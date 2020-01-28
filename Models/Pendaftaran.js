const mongoose = require('mongoose');
const {Schema} = mongoose;

const PasienSchema = new mongoose.Schema({
    rm: {
        type: String,
        required: true,
    },
    nama: {
        type: String,
        required: true,
    },
    nik: String,
    kelamin: Number,
    ttl: String,
    kebangsaan: Number,
    alamat: String,
    telp: String,
    agama: Number,
    perkawinan: Number,
    pekerjaan: Number,
    pendidikan: Number
});

const PjSchema = new mongoose.Schema({
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
});

const schema = new Schema({
    pasien: {
        type: PasienSchema,
        required: true
    },
    pj: {
        type: PjSchema,
        required: true
    },
    jenis: {
        type: Number,
        required: true,
        default: 1
    },
    tanggal: {
        type: Schema.Types.Date,
        required: true,
        default: new Date()
    }
});

module.exports = schema;
