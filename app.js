const express = require('express')
const app = express();
const mongoose = require('mongoose')

//connection MongoDB
const URL = 'mongodb+srv://camilo:a6607847@hospitalangular.j5ckr.mongodb.net'

mongoose.connect(URL,
    {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => {
        console.log('connect MongoDB')
    })
    .catch(e => {
        console.log('error: ' + e )
    })





//Routes
app.get('/',(req, res, next) => {
    res.status(200).json({
        ok: true,
        msg: 'msg success'
    })
})


app.listen(3000, () => {
    console.log('express port: 3000', 'online')
})




