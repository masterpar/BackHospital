const express = require('express')
const app = express();


// models
const Doctor = require('../models/doctor.model');
const mdAuthentication = require('../middlewares/authentication');


//=============================================
// get all Doctors
//============================================
app.get('/',(req, res) => {

    let from = req.query.from || 0;
    from = Number(from);

    Doctor.find({ }, 'name user hospital ')
        .skip(from) // # + users
        .limit(5) //paginate
        .populate('user', 'name email')
        .populate('hospital')
        .exec(
            (err, Doctors) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        msg: 'error Doctor uploading',
                        errors: err
                    })
                }

                Doctor.countDocuments({}, (err, count) => {
                    return res.status(200).json({
                        ok: true,
                        Doctors,
                        total: count
                    })
                })
            })

});


// ==============================================
// Create new Doctor
// ==============================================
app.post('/', mdAuthentication.verifyToken ,(req, res) => {

    const body = req.body;
    const doctor = new Doctor({
        name: body.name,
        img: body.img,
        user: req.user._id,
        hospital: body.hospital,
    });

    doctor.save( (err, savedDoctor) => {
        if (err){
            return res.status(400).json({
                ok: false,
                msg: 'error creating Doctor',
                errors: err
            })
        }

        res.status(201).json({
            ok: true,
            user: savedDoctor,
            userToken: req.user
        })
    });
});

//=============================================
// Update Doctor
//============================================
app.put('/:id', mdAuthentication.verifyToken , (req, res) => {

    const id = req.params.id;
    const body = req.body;

    Doctor.findById( id, (err, Doctor ) => {
        if (err){
            return res.status(500).json({
                ok: false,
                msg: 'error searching for Doctor',
                errors: err
            })
        }
        if(!Doctor){
            return res.status(400).json({
                ok: false,
                msg: 'the Doctor with the id '+id + ' does not exist',
                errors: { message: 'the Doctor with the id '+id + ' does not exist' }
            })
        }

        Doctor.name = body.name;
        Doctor.user = body.user._id;
        Doctor.hospital = body.hospital;

        Doctor.save( (err, savedDoctor) => {
            if (err){
                return res.status(400).json({
                    ok: false,
                    msg: 'error updating Doctor',
                    errors: err
                })
            }

            res.status(201).json({
                ok: true,
                Doctor: savedDoctor
            })
        })

    })
})

//=============================================
// Delete Doctor by id
//============================================
app.delete('/:id', mdAuthentication.verifyToken, (req, res) => {
    const id = req.params.id;
    Doctor.findByIdAndRemove(id, (err, DoctorDeleted) => {

        if (err){
            return res.status(500).json({
                ok: false,
                msg: 'error deleting Doctor',
                errors: err
            })
        }

        if (!DoctorDeleted){
            return res.status(400).json({
                ok: false,
                msg: 'the Doctor with this id does not exist',
                errors: { message: 'Doctor not exist'}
            })
        }

        res.status(200).json({
            ok: true,
            Doctor: DoctorDeleted
        })

    })
})


module.exports = app;
