const express = require('express');
const fs = require('fs');
const app = express();


app.get('/:type/:img',(req, res, next) => {

    const type = req.params.type;
    const img = req.params.img;

    let path = `./uploads/${type}/${img}`;

    fs.access(path, err => {
         if(err)  path = './assets/img/user_default.png';
        res.sendfile(path);
    })



});

module.exports = app;
