const mongoose = require("mongoose");

const Users = new mongoose.Schema({
    username:
    {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    }
});

const userSchema = mongoose.model("User", Users);
module.exports = userSchema;