const express = require('express')
const app = express();


// models
const Hospital = require('../models/hospital.model');
const mdAuthentication = require('../middlewares/authentication');


//=============================================
// get all hospitals
//============================================
app.get('/',(req, res) => {

    let from = req.query.from || 0;
    from = Number(from);

    Hospital.find({})
        .skip(from) // # + users
        .limit(5) //paginate
        .populate('user', 'name email')
        .exec(
            (err, hospitals) => {
                if (err){
                    return res.status(500).json({
                        ok: false,
                        msg: 'error hospital uploading',
                        errors: err
                    })
                }

                Hospital.countDocuments({}, (err, count) => {
                    return res.status(200).json({
                        ok: true,
                        hospitals,
                        total: count
                    })
                })
            })
});

//=============================================
// get Hospital
//============================================

app.get('/:id', (req,res)=> {
    const id = req.params.id;
    Hospital.findById(id)
        .populate('user', 'name img email')
        .exec((err,hospital)=> {
            if (err){
                return res.status(500).json({
                    ok: false,
                    msg: 'error searching hospital',
                    errors: err
                })
            }
            if(!hospital){
                return res.status(400).json({
                    ok: false,
                    msg: 'Hospital not exist',
                    errors: { message: 'No exist Hospital'}
                })
            }

            res.status(200).json({
                ok: true,
                hospital
            })
        })
})

// ==============================================
// Create new Hospital
// ==============================================
app.post('/', mdAuthentication.verifyToken ,(req, res) => {

    const body = req.body;
    const hospital = new Hospital({
        name: body.name,
        img: body.img,
        user: req.user._id,
    });

    hospital.save( (err, savedHospital) => {
        if (err){
            return res.status(400).json({
                ok: false,
                msg: 'error creating Hospital',
                errors: err
            })
        }

        res.status(201).json({
            ok: true,
            user: savedHospital,
            userToken: req.user
        })
    });
});

//=============================================
// Update Hospital
//============================================
app.put('/:id', mdAuthentication.verifyToken , (req, res) => {

    const id = req.params.id;
    const body = req.body;

    Hospital.findById( id, (err, hospital ) => {
        if (err){
            return res.status(500).json({
                ok: false,
                msg: 'error searching for hospital',
                errors: err
            })
        }
        if(!hospital){
            return res.status(400).json({
                ok: false,
                msg: 'the hospital with the id '+id + ' does not exist',
                errors: { message: 'the hospital with the id '+id + ' does not exist' }
            })
        }

        hospital.name = body.name;
        hospital.user = body.user._id;

        hospital.save( (err, savedHospital) => {
            if (err){
                return res.status(400).json({
                    ok: false,
                    msg: 'error updating hospital',
                    errors: err
                })
            }

            res.status(201).json({
                ok: true,
                hospital: savedHospital
            })
        })

    })
})

//=============================================
// Delete Hospital by id
//============================================
app.delete('/:id', mdAuthentication.verifyToken, (req, res) => {
    const id = req.params.id;
    Hospital.findByIdAndRemove(id, (err, hospitalDeleted) => {

        if (err){
            return res.status(500).json({
                ok: false,
                msg: 'error deleting hospital',
                errors: err
            })
        }

        if (!hospitalDeleted){
            return res.status(400).json({
                ok: false,
                msg: 'the hospital with this id does not exist',
                errors: { message: 'hospital not exist'}
            })
        }

        res.status(200).json({
            ok: true,
            hospital: hospitalDeleted
        })

    })
})


module.exports = app;
