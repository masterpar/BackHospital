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

//=============================================
// verify Admin
//============================================
exports.verifyAdminRole = function (req, res, next) {

    const user = req.user;


    if(user.role === 'ADMIN_ROLE'){
        next();
    } else {
        return res.status(401).json({
            ok: false,
            msg: 'Token Invalid',
            errors: { message: 'Not is Administrator'}
        })
    }

}

//=============================================
// verify Same User
//============================================
exports.verifySameUser_Admin = function (req, res, next) {

    const user = req.user;
    const id = req.params.id;

    if(user.role === 'ADMIN_ROLE' || user._id === id ){
        next();
    } else {
        return res.status(401).json({
            ok: false,
            msg: 'Token Invalid - not the same User',
            errors: { message: 'Not is Administrator - not the same User'}
        })
    }

}
