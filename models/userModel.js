const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    name : {
        type : String,
        trim: true,
        required : [true, 'A user must have a name.'],
        minLength : 3,
    },
    email : {
        type : String,
        trim: true,
        unique : true,
        lowercase: true,
        required : [true, 'A user must have an email.'],
        validate : [validator.isEmail, 'A User must have a valid email.'],
    },
    profilePicture : {
        type : String,
        required : false,
        default : '../public/img/user.jpg',
    },
    password : {
        type : String,
        required : true,
        minLength : [8, 'a password must be at least 8 characters'],
    },
    passwordChangedAt: Date,
    resetToken: String,
    passwordResetExpires: Date,
    active: {
        type: Boolean,
        default: true,
        select: false,
    },
});

userSchema.methods.correctPassword = async function (input, userPassword) {
    return bcrypt.compare(input, userPassword);
};

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')){
        return next();
    }
    this.password = await bcrypt.hash(this.password, 12);
    next();
});

const User = mongoose.model('User', userSchema);
module.exports = User;