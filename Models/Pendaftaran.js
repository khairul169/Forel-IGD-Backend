const mongoose = require('mongoose');
const {Schema} = mongoose;
const PasienSchema = require('./Schemas/Pasien');
const PjSchema = require('./Schemas/Pj');

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

const Pendaftaran = mongoose.model('Pendaftaran', schema, 'pendaftaran');

module.exports = Pendaftaran;
