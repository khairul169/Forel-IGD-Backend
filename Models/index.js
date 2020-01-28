const mongoose = require('mongoose');
const UserSchema = require('./User');
const PendaftaranSchema = require('./Pendaftaran');

const User = mongoose.model('User', UserSchema, 'users');
const Pendaftaran = mongoose.model('Pendaftaran', PendaftaranSchema, 'pendaftaran');

module.exports = {
    User,
    Pendaftaran
};
