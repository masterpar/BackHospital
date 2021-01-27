const express = require('express')
const mongoose = require('mongoose')
const app = express();

//connection MongoDB
const URL = 'mongodb+srv://camilo:a6607847@hospitalangular.j5ckr.mongodb.net'

//Routes
const appRoutes = require('./routes/app.route')
const userRoutes = require('./routes/user.route')
const loginRoutes = require('./routes/login.route')

mongoose.connect(URL,
    {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true
    })
    .then(() => {
        console.log('connect MongoDB')
    })
    .catch(e => {
        console.log('error: ' + e )
    })


//Json Data
app.use(express.json())

//Routes
app.use('/', appRoutes);
app.use('/user', userRoutes);
app.use('/login', loginRoutes);

app.listen(3000, () => {
    console.log('express port: 3000', 'online')
})




