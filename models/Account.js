const mongoose = require("mongoose");
require('dotenv').config();

function generate(n) {
    var add = 1, max = 12 - add;

    if ( n > max ) {
        return generate(max) + generate(n - max);
    }
    max  = Math.pow(10, n+add);
    var min  = max/10;
    var number = Math.floor( Math.random() * (max - min + 1) ) + min;
    return ("" + number).substring(add);
}

const AccountSchema = mongoose.Schema({
    account_number: {
        type: String,
        default: process.env.BANK_PREFIX + generate(15)
    },
    balance: {
        type: Number,
        default: 20000,
    },
    currency: {
        type: String,
        minlength: 3,
        maxlength: 3,
        default: "EUR"
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
});


module.exports = mongoose.model("Account", AccountSchema);