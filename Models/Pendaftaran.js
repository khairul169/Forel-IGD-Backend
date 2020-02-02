const mongoose = require('mongoose');
const {Schema} = mongoose;

const schema = new Schema({
    // Nomor identitas
    rm: {
        type: String,
        required: true,
    },

    // Pasien
    nama: {
        type: String,
        required: true,
    },
    nik: String,
    kelamin: String,
    tempatLahir: String,
    tglLahir: Date,
    kebangsaan: String,
    alamat: String,
    telp: String,
    agama: String,
    perkawinan: String,
    pekerjaan: String,
    pendidikan: String,
    
    // Penanggung jawab
    namaPj: {
        type: String,
        required: true,
    },
    nikPj: String,
    kelaminPj: String,
    hubungan: String,
    alamatPj: String,
    telpPj: String,
    pekerjaanPj: String,
    pendidikanPj: String,
    wali: String,
    telpWali: String,

    // Registrasi
    jenis: {
        type: String,
        required: true,
        default: 1
    },
    pembayaran: String,
    tanggal: {
        type: Date,
        required: true,
        default: Date.now
    }
});

const Pendaftaran = mongoose.model('Pendaftaran', schema, 'pendaftaran');

module.exports = Pendaftaran;
