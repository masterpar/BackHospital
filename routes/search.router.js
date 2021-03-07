const express = require('express')
const app = express();

// models
 const Hospital = require('../models/hospital.model');
const Doctor = require('../models/doctor.model');
const User = require('../models/user.model');




//=============================================
// search by collection
//============================================
app.get('/collection/:table/:search', (req, res) => {

    const table = req.params.table;
    const search = req.params.search;
    const regex = new RegExp(search, 'i');
    let promise;

    switch (table) {

        case 'users':
            promise = searchUsers(search, regex)
            break;
        case 'hospitals':
            promise = searchHospitals(search, regex)
            break;
        case 'doctors':
            promise = searchDoctors(search, regex)
            break;
        default:
            res.status(400).json({
                ok: false,
                message: 'search types are only users, hospitals and doctors',
                error: {message: 'invalid type collection '}
            })
    }

    promise.then( data => {
        res.status(200).json({
            ok: true,
            [table] : data
        })
    })


})


//=============================================
// search general
//============================================
app.get('/all/:search' ,(req, res) => {

    const search = req.params.search;
    const regex = new RegExp( search, 'i');

    Promise.all( [
        searchHospitals(search, regex),
        searchDoctors(search, regex),
        searchUsers(search, regex)
    ])
        .then( response => {
            res.status(200).json({
                ok: true,
                hospitals: response[0],
                doctors: response[1],
                users: response[2]
            })
        })
});


// search hospital Promise
const searchHospitals = (search, regex) => {

    return new Promise( (resolve, reject) =>{
        Hospital.find({ name: regex })
            . populate( 'user', 'name email img')
            .exec((err, hospitals) =>{
            if (err ){
                reject('error loading hospitals')
            } else {
                resolve(hospitals)
            }
        })
    } )

}

// search Doctor Promise
const searchDoctors = (search, regex) => {

    return new Promise( (resolve, reject) =>{
        Doctor.find({ name: regex })
            .populate('user', 'name email img')
            .populate('hospital')
            .exec((err, doctors) => {
            if (err ){
                reject('error loading doctors')
            } else {
                resolve(doctors)
            }
        })
    } )

}

// search Users Promise
const searchUsers = (search, regex) => {

    return new Promise( (resolve, reject) =>{
        User.find({}, 'name email img role')
            .or( [
                { 'name': regex },
                { 'email': regex },
                ])
            .exec( ( err, users ) => {
                if( err){
                    reject('error users loading ')
                } else {
                    resolve(users)
                }
            })
    } )

}

module.exports = app;
