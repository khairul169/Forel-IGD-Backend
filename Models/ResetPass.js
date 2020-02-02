const mongoose = require('mongoose');
const {Schema} = mongoose;

const schema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        required: true,
    },
    secret: Number,
});

const ResetPass = mongoose.model('ResetPass', schema, 'reset_pass');

module.exports = ResetPass;
