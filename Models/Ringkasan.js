const mongoose = require('mongoose');
const {Schema} = mongoose;

const schema = new Schema({
    pendaftaran: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Pendaftaran',
    },
    keadaanUmum: String,
    keadaan: String,
    eye: String,
    movement: String,
    verbal: String,
    td: String,
    nadi: String,
    bb: String,
    sat: String,
    suhu: String,
    rr: String,
    reguler: String,
    ews: String,
    nyeri: String,
    skalaNyeri: String,
});

const Ringkasan = mongoose.model('Ringkasan', schema, 'ringkasan');

module.exports = Ringkasan;
