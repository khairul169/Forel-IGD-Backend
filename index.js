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

const createHash = (string) => crypto.createHash('md5').update(string).digest('hex');

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.json({hello: 'world!'});
});

app.post('/register', async (req, res) => {
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

app.post('/login', async (req, res) => {
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

app.get('/user', auth, async (req, res) => {
    try {
        const user = await models.User.findById(req.userId);
        res.json({result: user});
    } catch (error) {
        res.json({error: error.errmsg});
    }
});

app.post('/pasien_baru', auth, async (req, res) => {
    const data = req.body;
    
    try {
        if (!data.pasien || !data.pj) {
            throw new Error('Data tidak lengkap.');
        }
        
        if (!data.pasien.rm.trim() || !data.pasien.nama.trim()) {
            throw new Error('RM dan Nama pasien tidak boleh kosong.');
        }
        
        if (!data.pj.nama.trim()) {
            throw new Error('Nama penanggung jawab tidak boleh kosong.');
        }

        // Set jenis pasien
        data.jenis = data.pasien.jenis;

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

app.get('/pendaftaran', auth, async (req, res) => {
    try {
        let rows = await models.Pendaftaran.find({}).sort('-tanggal');
        res.json({result: rows});
    } catch (error) {
        res.json({error});
    }
});

app.get('/pendaftaran/jenis/:jenis', auth, async (req, res) => {
    try {
        let rows = await models.Pendaftaran.find({jenis: req.params.jenis}).sort('-tanggal');
        res.json({result: rows});
    } catch (error) {
        res.json({error});
    }
});

app.get('/pendaftaran/id/:id', auth, async (req, res) => {
    try {
        let rows = await models.Pendaftaran.findById(req.params.id);
        res.json({result: rows});
    } catch (error) {
        res.json({error});
    }
});

app.post('/pendaftaran', auth, async (req, res) => {
    try {
        const {rm, nama, jenis, ttl} = req.body;
        const searchQuery = {};

        if (jenis) {
            searchQuery.jenis = jenis;
        }

        if (rm) searchQuery['pasien.rm'] = {
            $regex: rm,
            $options: 'i'
        };

        if (nama) searchQuery['pasien.nama'] = {
            $regex: nama,
            $options: 'i'
        };

        if (ttl) searchQuery['pasien.ttl'] = {
            $regex: ttl,
            $options: 'i'
        };

        const rows = await models.Pendaftaran.find(searchQuery).sort('-tanggal');
        res.json({result: rows});
    } catch (error) {
        res.json({error: error.errmsg});
    }
});

app.get('/pengkajian/:id', auth, async (req, res) => {
    try {
        const row = await models.Pengkajian.findOne({pendaftaran: req.params.id});
        res.json({result: row});
    } catch (error) {
        res.json({error});
    }
});

app.post('/pengkajian', auth, async (req, res) => {
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
