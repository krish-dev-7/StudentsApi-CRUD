const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const studentSchema = new Schema({
    studId : {
        type: String,
        unique: true,
        required: true
    },
    name : {
        type: String,
        required: true
    },
    dept : { 
        type: String,
        required: true 
    },
    year : { 
        type: String, 
        required: true
    },
    regNo : { 
        type: String, 
        unique: true,
        required: true 
    }
});

const Student = new mongoose.model('Student', studentSchema);

module.exports = Student;