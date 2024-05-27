const catchAsync = require('../utils/catchAsync');
const User = require('../models/userModel');
const List = require('../models/listModel');
const fs = require('fs');
const {promisify} = require('util');

exports.updateUserData = catchAsync(async (req, res, next) => {
    if (!req.file && req.body.deletePic) {
        const user = await User.findOne({ email : req.user.email });
        if (user.profilePicture !== '/img/user.png') {
            await promisify(fs.unlink)(`./public${user.profilePicture}`);
        }
        await User.findOneAndUpdate({
            email : req.user.email,
        },
        {
            profilePicture : '/img/user.png',
        },
        {
            runValidators : true,
        });
        return res.redirect('/profile');
    }
    await User.findOneAndUpdate({
        email : req.user.email,
    },
    {
        ...req.body,
        profilePicture : req.file ? `/img/${req.user._id}.jpg` : req.user.profilePicture,
    },
    {
        runValidators : true,
    });
    res.redirect('/profile');
});