const mongoose = require('mongoose');
const {Schema} = mongoose;

const schema = new Schema({
    pendaftaran: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Pendaftaran',
    },
    waktuKeluar: Date,
    tindakLanjut: String,
    pindah: String,
    dirujukKe: String,
    alasanRujuk: String,
    rujukKe: String,
    rujukKeLain: String,
    pulang: String,
    menolakRawat: String,
    kontrol: String,
    edukasi: String,
    diet: String,
    minumObat: String,
    edukasiLain: String,
    obatPulang: String,
});

const TindakLanjut = mongoose.model('TindakLanjut', schema, 'tindak_lanjut');

module.exports = TindakLanjut;
