const express = require('express')
const app = express();

const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const SEED = require('../config/config').SEED;
// models
const User = require('../models/user.model');

// google
const {OAuth2Client} = require('google-auth-library');
const GOOGLE_CLIENT_ID = require('../config/config')


//=============================================
// login server
//============================================
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

//=============================================
// login google
//============================================
app.post('/google', (req, res) => {

    const token = req.body.token || '';

    const client = new OAuth2Client(GOOGLE_CLIENT_ID);

    async function verify() {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: GOOGLE_CLIENT_ID
        });
        const payload = ticket.getPayload();
        const userid = payload['sub'];

        //mongo
        User.findOne({ emal: payload.email}, (err, user) =>{
            if (err){
                return res.status(500).json({
                    ok: false,
                    message: 'Error searching user',
                    errors: err,

                })
            }
                // verify user type google/server/no exist
            if (user){
                if (user.google === false){
                    return res.status(400).json({
                        ok: false,
                        message: 'you must use your normal authentication',
                        errors: err,
                    })
                } else {
                    //--------- Token ----------
                    user.password = ':)';
                    const token = jwt.sign(
                        { user: user },
                        SEED,
                        { expiresIn: 14400}
                    )

                    return res.status(200).json({
                        ok: true,
                        user: user,
                        token: token,
                        id: user._id
                    })
                }
                // user no exists for email
            } else {
                const user = new User();
                user.name = payload.name;
                user.email = payload.email;
                user.password = '-_-';
                user.img = payload.picture;
                user.google = true;

                // save user
                user.save((err, userDB) => {
                    if (err){
                        return res.status(500).json({
                            ok: false,
                            message: 'Error searching user - google',
                            errors: err,
                        })
                    }

                    //--------- Token ----------
                    user.password = ':)';
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
            }
        })

    }
    verify().catch(err => {
        return res.status(400).json({
            ok: false,
            errors: err,

        })
    });

})


module.exports = app;
