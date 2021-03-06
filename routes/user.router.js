const express = require('express')
const app = express();

const bcrypt = require('bcryptjs')

// models
const User = require('../models/user.model');
const mdAuthentication = require('../middlewares/authentication');


//=============================================
// get all users
//============================================
app.get('/',(req, res) => {

    let from = req.query.from || 0;
    from = Number(from);

    User.find({ }, 'name email img role google')
        .skip(from) // # + users
        .limit(5) //paginate
        .exec(
    (err, users) => {
        if (err){
            return res.status(500).json({
                ok: false,
                msg: 'error user uploading',
                errors: err
            })
        }

        User.countDocuments({},(err, count) => {
            return res.status(200).json({
                ok: true,
                users,
                total: count
            })
        })

    })
});


// ==============================================
// Create new User
// ==============================================
app.post('/',(req, res) => {

    const body = req.body;
    const user = new User({
        name: body.name,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        img: body.img,
        role: body.role,
    });

    user.save( (err, savedUser) => {
        if (err){
            return res.status(400).json({
                ok: false,
                msg: 'error creating user',
                errors: err
            })
        }

        res.status(201).json({
            ok: true,
            user: savedUser,
            userToken: req.user
        })
    });
});

//=============================================
// Update User
//============================================
app.put('/:id', [mdAuthentication.verifyToken, mdAuthentication.verifySameUser_Admin] , (req, res) => {

    const id = req.params.id;
    const body = req.body;

    User.findById( id, (err, user ) => {
        if (err){
            return res.status(500).json({
                ok: false,
                msg: 'error searching for user',
                errors: err
            })
        }
        if(!user){
            return res.status(400).json({
                ok: false,
                msg: 'the user with the id '+id + ' does not exist',
                errors: { message: 'the user with the id '+id + ' does not exist' }
            })
        }

        user.name = body.name;
        user.email = body.email;
        user.role = body.role;

        user.save( (err, savedUser) => {
            if (err){
                return res.status(400).json({
                    ok: false,
                    msg: 'error updating user',
                    errors: err
                })
            }

            savedUser.password = ':)'

            res.status(201).json({
                ok: true,
                user: savedUser
            })
        })

    })
})

//=============================================
// Delete User by id
//============================================
app.delete('/:id', [mdAuthentication.verifyToken, mdAuthentication.verifyAdminRole] , (req, res) => {
    const id = req.params.id;
    User.findByIdAndRemove(id, (err, userDeleted) => {

        if (err){
            return res.status(500).json({
                ok: false,
                msg: 'error deleting user',
                errors: err
            })
        }

        if (!userDeleted){
            return res.status(400).json({
                ok: false,
                msg: 'the user with this id does not exist',
                errors: { message: 'user not exist'}
            })
        }

        res.status(200).json({
            ok: true,
            user: userDeleted
        })

    })
})


module.exports = app;
