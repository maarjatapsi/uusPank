const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Account = require('../models/Account');
const { check, validationResult } = require('express-validator');

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



module.exports = router;