const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const medicoSchema = new Schema({

    name: { type: String, required: [ true, 'the name is required'] },
    img: { type: String, required:  false },
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    hospital: {
        type: Schema.Types.ObjectId,
        ref: 'Hospital',
        required: [true, 'hospital id is a mandatory field']
    }
})

module.exports = mongoose.model('Doctor', medicoSchema);
