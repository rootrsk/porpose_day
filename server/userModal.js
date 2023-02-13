const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    
    username:{
        type: String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    showname:{
        type:String,
    },
    show_promise:{
        type:Boolean                
    },
    cheese_line:{
        type: String,
    },
    terms_and_conditions:[{
        type:String
    }],
    proporsals:[{}],
    instagram:{
        type:String
    }
})

const User = mongoose.model("user",userSchema)

module.exports = User