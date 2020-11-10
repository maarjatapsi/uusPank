const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Account = require('../models/Account');
const { check, validationResult } = require('express-validator');
const {verifyToken} = require('../middlewares');
const Sessions = require('../models/Session');

//registers an user
router.post('/', async (req, res) => {
    const user = new User({
        name: req.body.name,
        username: req.body.username,
        password: req.body.password
    });

    const account = new Account({
        user: user._id
    });

    try {
        const savedUser = await user.save();
        const savedAccount = await account.save();
        res.header('location', '/users/' + savedUser._id);
        res.json(savedUser);
    } catch (e) {
        res.statusCode = 400
        res.json({error: e.message});
    }
});

// Account details
router.get('/account', verifyToken, async (req, res) => {
    try {

        // Get a specific users session token
        const sessionId = req.headers.authorization.split(' ')[1]

        // Find a session with the provided Id
        const session = await Sessions.findOne({ _id:sessionId });

        const user = await User.findOne({_id: session.userId}).select({ "name": 1, "username": 1, "password": 1, "_id": 0 });

        if (!user) {
            res.status(404).json({error: "User not found"})
        }

        const userAccount = await Account.findOne({user: session.userId}).select({ "account_number": 1, "balance": 1, "currency": 1, "user": 1, "_id": 0 });

        if (!userAccount) {
            res.status(404).json({error: "Account not found"})
        }

        res.status(200).json({
            name: user.name,
            username: user.username,
            account: [{
                account_number: userAccount.account_number,
                balance: userAccount.balance,
                currency: userAccount.currency
            }]
        });

    } catch (e) {
        res.statusCode = 500
        res.json({error: e.message});
    }
});



module.exports = router;