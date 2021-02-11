const express = require('express')
const app = express();

const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const SEED = require('../config/config').SEED;
// models
const User = require('../models/user.model');

app.post('/', (req, res) => {

    const body = req.body;

    User.findOne({ email: body.email }, (err, userDB) => {

        if (err){
            return res.status(500).json({
                ok: false,
                msg: 'error searching user',
                errors: err
            })
        }

        if (!userDB){
            return res.status(200).json({
                ok: false,
                msg: 'incorrect credentials',
                errors: err
            })
        }

        if (!bcrypt.compareSync( body.password, userDB.password)){
            return res.status(200).json({
                ok: false,
                msg: 'incorrect credentials p',
                errors: err
            })
        }

        //--------- Token ----------
        userDB.password = ':)';
        const token = jwt.sign(
            { user: userDB },
            SEED,
            { expiresIn: 14400}
            )

        return res.status(200).json({
            ok: true,
            user: userDB,
            token: token,
            id: userDB._id
        })
    })


})



module.exports = app;
