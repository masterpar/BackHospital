const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const rolesValid = {
    values: [ 'ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} is not a permitted role'
}

const userSchema = new Schema({

    name: { type: String, required: [ true, 'the name is required'] },
    email: { type: String, unique:true, required: [ true, 'the email is required'] },
    password: { type: String, required: [ true, 'the password is required'] },
    img: { type: String, required:  false },
    role: { type: String, required:  true, default: 'USER_ROLE', enum: rolesValid },
})


userSchema.plugin( uniqueValidator, { message: 'the {PATH} must be unique'} )

module.exports = mongoose.model('User', userSchema);
