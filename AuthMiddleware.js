const models = require('./Models');

const auth = async (req, res, next) => {
    const authHeader = req.header('Authorization');
    const token = authHeader ? authHeader.replace('Bearer', '').trim() : null;

    try {
        const user = await models.Users.findOne({token});
        if (!user) {
            throw new Error();
        }

        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({error: 'Not authorized.'});
    }
}

module.exports = auth;
