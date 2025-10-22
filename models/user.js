const { number } = require("joi");
const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");
const Schema = mongoose.Schema;
const userSchema = new Schema({
    // username:{
    //     type:String,
    //     required:true
    // },
    email:{
        type:String,
        required:true,
        unique: true
    },
    day:{
        type:String,
        required:true
    },
    month:{
        type:String,
        required:true
    },
    gender:{
        type:String,
        required:true
    },
    year:{
        type:Number,
        required:true
    },
  //That add username and password properties in schema

})
//combine pasportlocalmongoose with userSchema ...
// userSchema.plugin(passportLocalMongoose);
/////gpt///
userSchema.plugin(passportLocalMongoose, { usernameField: 'email' });

module.exports = mongoose.model("User",userSchema);
