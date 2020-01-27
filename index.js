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
    const user = new models.Users({
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
        let user = await models.Users.findOneAndUpdate({userId: data.userId, pin: pinHash}, {token});
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
        const user = await models.Users.findById(req.userId);
        res.json({result: user});
    } catch (error) {
        res.json({error: error.errmsg});
    }
});

app.post('/pasien_baru', async (req, res) => {
    const data = req.body;
    
    try {
        console.log(data);
        if (!data.pasien || !data.pj) {
            throw new Error('Data tidak lengkap.');
        }
        
        if (!data.pasien.rm.trim() || !data.pasien.nama.trim()) {
            throw new Error('RM dan Nama pasien tidak boleh kosong.');
        }
        
        if (!data.pj.nama.trim()) {
            throw new Error('Nama penanggung jawab tidak boleh kosong.');
        }

        const pasien = new models.Pasien(data.pasien);
        const pasienResult = await pasien.save();

        if (!pasienResult) {
            throw new Error('Gagal menyimpan data pasien.');
        }

        const pj = new models.PJPasien(data.pj);
        const pjResult = await pj.save();

        if (!pjResult) {
            throw new Error('Gagal menyimpan data penanggung jawab.');
        }

        const pendaftaran = new models.Pendaftaran({
            pasienId: pasienResult._id,
            pjId: pjResult._id,
            jenis: data.jenis
        });
        const result = await pendaftaran.save();

        if (!result) {
            throw new Error('Gagal menyimpan data pendaftaran.');
        }

        res.json({result});
    } catch ({message}) {
        res.json({error: message});
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
