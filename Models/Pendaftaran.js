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

const PjSchema = new mongoose.Schema({
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
        type: String,
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
