const mongoose = require('mongoose');
const {Schema} = mongoose;

const schema = new Schema({
    pasienId: {
        type: Schema.Types.ObjectId,
        required: true
    },
    pjId: {
        type: Schema.Types.ObjectId,
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
})

const Model = mongoose.model('Pendaftaran', schema);

module.exports = Model;
