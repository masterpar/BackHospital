const jwt = require('jsonwebtoken')
const SEED = require('../config/config').SEED;

//=============================================
// verify Token
//============================================
exports.verifyToken = function (req, res, next) {

    const token = req.query.token;

    jwt.verify( token, SEED, (err, decoded) => {

        if (err){
            return res.status(401).json({
                ok: false,
                msg: 'Token Invalid',
                errors: err
            })
        }

        req.user = decoded.user
        next();

    })
}
