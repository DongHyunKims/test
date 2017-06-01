/**
 * Created by donghyunkim on 2017. 6. 1..
 */

const mongoose = require("mongoose");
const { Schema }  = mongoose;


mongoose.Promise = global.Promise;


const userSchema = new Schema({
    name: {type: String, required: true},
    tag: [],
    img: {type: String, required: true},
    date: {type: Date, default: Date.now }
});

module.exports = mongoose.model("users", userSchema);