const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const crypto = require('crypto');
const models = require('./Models');
const auth = require('./AuthMiddleware');

const PORT = 5000;
const app = express();
dotenv.config();

const BASE_URL = process.env.BASE_URL || '';
const createHash = (string) => crypto.createHash('md5').update(string).digest('hex');

app.use(cors());
app.use(express.json());

app.get(BASE_URL + '/', (req, res) => {
    res.json({hello: 'world!'});
});

app.post(BASE_URL + '/register', async (req, res) => {
    const data = req.body;

    if (typeof data.pin !== 'string' || data.pin.length < 6) {
        res.json({error: 'Pin kurang dari 6 angka/huruf.'});
        return;
    }

    if (data.pin !== data.konfirmasiPin) {
        res.json({error: 'Konfirmasi pin tidak sama.'});
        return;
    }

    const token = createHash(data.userId + new Date().getMilliseconds().toString());
    const user = new models.User({
        ...data,
        pin: createHash(data.pin),
        token
    });

    try {
        await user.save();
        res.json({result: {token}});
    } catch (error) {
        res.json({error});
    }
});

app.post(BASE_URL + '/login', async (req, res) => {
    const data = req.body;
    const pinHash = createHash(data.pin);
    try {
        const token = createHash(data.userId + new Date().getMilliseconds().toString());
        let user = await models.User.findOneAndUpdate({userId: data.userId, pin: pinHash}, {token});
        if (user) {
            res.json({result: {token}});
        } else {
            res.json({error: 'Cannot find user.'});
        }
    } catch (error) {
        res.json({error: error.errmsg});
    }
});

app.get(BASE_URL + '/user', auth, async (req, res) => {
    try {
        const user = await models.User.findById(req.userId);
        res.json({result: user});
    } catch (error) {
        res.json({error: error.errmsg});
    }
});

app.post(BASE_URL + '/pasien_baru', auth, async (req, res) => {
    const data = req.body;
    
    try {
        if (!data.rm.trim() || !data.nama.trim()) {
            throw new Error('RM dan Nama pasien tidak boleh kosong.');
        }
        
        if (!data.namaPj.trim()) {
            throw new Error('Nama penanggung jawab tidak boleh kosong.');
        }

        const pendaftaran = new models.Pendaftaran(data);
        const result = await pendaftaran.save();

        if (!result) {
            throw new Error('Gagal menyimpan data pendaftaran.');
        }

        res.json({result});
    } catch ({message}) {
        res.json({error: message});
    }
});

app.get(BASE_URL + '/pendaftaran', auth, async (req, res) => {
    try {
        let rows = await models.Pendaftaran.find({}).sort('-tanggal');
        res.json({result: rows});
    } catch (error) {
        res.json({error});
    }
});

app.get(BASE_URL + '/jumlah', auth, async (req, res) => {
    try {
        const now = new Date();
        const dateToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const today = {tanggal: {$gte: dateToday}};
        const ponek = await models.Pendaftaran.countDocuments({...today, jenis: '0'});
        const nonPonek = await models.Pendaftaran.countDocuments({...today, jenis: '1'});

        res.json({result: {
            total: ponek + nonPonek, ponek, nonPonek
        }});
    } catch (error) {
        res.json({error});
    }
});

app.get(BASE_URL + '/pendaftaran/:id', auth, async (req, res) => {
    try {
        let rows = await models.Pendaftaran.findById(req.params.id);
        res.json({result: rows});
    } catch (error) {
        res.json({error});
    }
});

app.post(BASE_URL + '/pendaftaran', auth, async (req, res) => {
    try {
        const {rm, nama, jenis, ttl} = req.body;
        const searchQuery = {};

        if (jenis) {
            searchQuery.jenis = jenis;
        }

        if (rm) searchQuery['rm'] = {
            $regex: rm,
            $options: 'i'
        };

        if (nama) searchQuery['nama'] = {
            $regex: nama,
            $options: 'i'
        };

        if (ttl) searchQuery['tempatLahir'] = {
            $regex: ttl,
            $options: 'i'
        };

        const rows = await models.Pendaftaran.find(searchQuery).sort('-tanggal');
        res.json({result: rows});
    } catch (error) {
        res.json({error: error.errmsg});
    }
});

app.get(BASE_URL + '/pengkajian/:id', auth, async (req, res) => {
    try {
        const row = await models.Pengkajian.findOne({pendaftaran: req.params.id});
        res.json({result: row});
    } catch (error) {
        res.json({error});
    }
});

app.post(BASE_URL + '/pengkajian', auth, async (req, res) => {
    try {
        const {id, data} = req.body;
        const result = await models.Pengkajian.findOneAndUpdate({ pendaftaran: id }, data, {
            new: true,
            upsert: true
        });
        res.json({result});
    } catch (error) {
        res.json({error});
    }
});

app.get(BASE_URL + '/ringkasan/:id', auth, async (req, res) => {
    try {
        const row = await models.Ringkasan.findOne({pendaftaran: req.params.id})
            .populate('pendaftaran');
        res.json({result: row});
    } catch (error) {
        res.json({error});
    }
});

app.post(BASE_URL + '/ringkasan', auth, async (req, res) => {
    try {
        const {id, data} = req.body;
        const result = await models.Ringkasan.findOneAndUpdate({ pendaftaran: id }, data, {
            new: true,
            upsert: true
        });
        res.json({result});
    } catch (error) {
        res.json({error});
    }
});

app.get(BASE_URL + '/rtl/:id', auth, async (req, res) => {
    try {
        const row = await models.TindakLanjut.findOne({pendaftaran: req.params.id})
            .populate('pendaftaran');
        res.json({result: row});
    } catch (error) {
        res.json({error});
    }
});

app.post(BASE_URL + '/rtl', auth, async (req, res) => {
    try {
        const {id, data} = req.body;
        const result = await models.TindakLanjut.findOneAndUpdate({ pendaftaran: id }, data, {
            new: true,
            upsert: true
        });
        res.json({result});
    } catch (error) {
        res.json({error});
    }
});

mongoose.connect(process.env.DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
}).then(() => {
    console.log('Database connected.');
});

app.listen(PORT, () => {
    console.log('Server listening on port', PORT);
});
