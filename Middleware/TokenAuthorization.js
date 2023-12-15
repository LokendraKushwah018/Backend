const jwt = require('jsonwebtoken');
const { user } = require('../config/db');
const secretKey = "testingpurposeonly"


const Authtoken = async (req, res, next) => {

    const token = req.headers.authorization;

    if (!token || !token.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Invalid or missing token' });
    }

    const tokenValue = token.substring(7);

    jwt.verify(tokenValue, secretKey, async (err, decodedToken) => {
        if (err) {
            return res.status(401).json({ message: 'Authentication failed' });
        }
        console.log(decodedToken, "decodedtoken")
        const userdata = await user.findOne({ where: { id: decodedToken.userID } })

        req.userdata = userdata.dataValues

        console.log(userdata, "____________________")
        return next()
    })
}

module.exports = { Authtoken }