const express = require('express')
const mongoose = require('mongoose')
const app = express();

//connection MongoDB
const URL = 'mongodb+srv://camilo:a6607847@hospitalangular.j5ckr.mongodb.net'

//Routes
const appRoutes = require('./routes/app.route')
const userRoutes = require('./routes/user.router')
const loginRoutes = require('./routes/login.router')
const hospitalRoutes = require('./routes/hospital.router')
const doctorRoutes = require('./routes/doctor.router')
const searchRoutes = require('./routes/search.router')
const uploadRoutes = require('./routes/upload.router')
const imagesRoutes = require('./routes/images.router')

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
app.use('/user', userRoutes);
app.use('/login', loginRoutes);
app.use('/hospital', hospitalRoutes);
app.use('/doctor', doctorRoutes);
app.use('/search', searchRoutes);
app.use('/upload', uploadRoutes);
app.use('/img', imagesRoutes);

app.use('/', appRoutes);

app.listen(3000, () => {
    console.log('express port: 3000', 'online')
})




