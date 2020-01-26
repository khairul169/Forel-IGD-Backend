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
        res.json({error: error.errmsg});
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
