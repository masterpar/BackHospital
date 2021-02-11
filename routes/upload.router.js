const express = require('express')
const app = express();
const fileUpload = require('express-fileupload');
const fs = require('fs');

// default options
app.use(fileUpload());

//models
const User = require('../models/user.model');
const Doctor = require('../models/doctor.model');
const Hospital = require('../models/hospital.model');



//=============================================
// upload Img
//============================================

app.put('/:type/:id',(req, res) => {

    const type = req.params.type;
    const id = req.params.id;

    // types of collections
    const typesValids = ['hospitals','doctors','users'];

    if ( typesValids.indexOf(type) < 0){
        return res.status(400).json({
            ok: false,
            msg: 'Type of collection invalid',
            errors: { message : 'Type of collection invalid'}
        })
    }

    // exist file
    if (!req.files){
        return res.status(400).json({
            ok: false,
            msg: 'no selection',
            errors: { message : 'you should select an image'}
        })
    }


    // get file name
    const file = req.files.image;
    const curtName = file.name.split('.');
    const extension = curtName[ curtName.length -1];

    // only these extensions accepted
    const extAcept = ['png', 'jpg', 'gif', 'jpeg'];

    // validating extensions
    if ( extAcept.indexOf( extension) < 0){
        return res.status(400).json({
            ok: false,
            msg: 'invalid extension',
            errors: { message : 'valid extensions are: ' + extAcept.join(', ')}
        })
    }


    // file name customized
    // name file: id user + 3 numer + extension
    const fileName = `${id}-${ new Date().getMilliseconds()}.${extension}`

    // file move
    const path = `./uploads/${ type }/${ fileName}`;

    file.mv( path, err => {
        if (err){
            return res.status(500).json({
                ok: false,
                msg: 'error when moving the file',
                errors: err
            })
        }
    })

// success
    upByType( type, id, fileName, res );

});

//=============================================
// up by type
//============================================

upByType = ( type, id, fileName, res ) =>{

    // type users
    if (type === 'users'){
        User.findById(id, (err, user)=> {

            if (!user){
                return res.status(400).json({
                    ok: true,
                    msg : "user does not exist",
                    errors: { message : 'user does not exist'}
                })
            }

            const pathOld= './uploads/users/' +  user.img;

            //if exists, delete the previous image
            if (fs.existsSync(pathOld)){
                fs.unlink(pathOld)
            }

            user.img = fileName;
            user.password = '';
            user.save( (err, updatedUser) => {

                    return res.status(200).json({
                        ok: true,
                        msg : "updated user image",
                        updatedUser
                    })
            })
        })
    }

    // type doctors
    if (type === 'doctors'){
        Doctor.findById(id, (err, doctor)=> {

            if (!doctor){
                return res.status(400).json({
                    ok: true,
                    msg : "doctor does not exist",
                    errors: { message : 'doctor does not exist'}
                })
            }

            const pathOld= './uploads/doctors/' +  doctor.img;

            //if exists, delete the previous image
            if (fs.existsSync(pathOld)){
                fs.unlink(pathOld)
            }

            doctor.img = fileName;
            doctor.password = '';
            doctor.save( (err, updatedDoctor) => {

                return res.status(200).json({
                    ok: true,
                    msg : "updated doctor image",
                    updatedDoctor
                })
            })
        })
    }

    // type hospitls
    if (type === 'hospitals'){
        Hospital.findById(id, (err, hospital)=> {

            if (!hospital){
                return res.status(400).json({
                    ok: true,
                    msg : "hospital does not exist",
                    errors: { message : 'hospital does not exist'}
                })
            }


            const pathOld= './uploads/hospitals/' +  hospital.img;

            //if exists, delete the previous image
            if (fs.existsSync(pathOld)){
                fs.unlink(pathOld)
            }

            hospital.img = fileName;
            hospital.password = '';
            hospital.save( (err, updatedHospital) => {

                return res.status(200).json({
                    ok: true,
                    msg : "updated hospital image",
                    updatedHospital
                })
            })
        })
    }
}


module.exports = app;
