const mongoose = require("mongoose");
const uniqueValidator = require('mongoose-unique-validator');

const UserSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name required"]
    },
    username: {
        type: String,
        required: [true, "Username required"],
        unique: [true],
        dropDups: [true]
    },
    password: {
        type: String,
        required: [true, "Password Required"]
    }
});

// Apply the uniqueValidator plugin to userSchema.
UserSchema.plugin(uniqueValidator, { message: 'Username already exists!' });

module.exports = mongoose.model("Users", UserSchema);