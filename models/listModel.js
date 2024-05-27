const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
        taskText : {
            type : String,
            required : true,
        },
        done : {
            type : Boolean,
            default : false,
        },
});

const listSchema = new mongoose.Schema({
    name : {
        type : String,
        required : [true, 'A list must have a name.'],
        trim : true, 
    },
    description : {
        type : String,
        default : "things I want to do/achieve",
    },
    date : {
        type : Date,
        default : Date.now(),
    },
    createdAt : {
        type : Date,
        default : Date.now(),
        select : false,
    },
    tasks : [taskSchema],
    user : {
        type : mongoose.Schema.ObjectId,
        ref : 'User',
        required : true,
    },
    coverPhoto : {
        type : String,
        required : false,
        default : "/img/list.png",

    }
});

const List = mongoose.model('List', listSchema);
module.exports = List;