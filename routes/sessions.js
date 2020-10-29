const express = require('express');
const router = express.Router();
const Users = require('../models/User');
const { verifyToken } = require('../middlewares');
const Sessions = require('../models/Session');

//Creating a session
router.post('/', async (req, res) => {
    try {
        //Checks if the username and password exist
        const user = await Users.findOne({username: req.body.username, password: req.body.password});
        if (!user) {
            // Returns if the username and/or password is invalid
            return res.status(401).json({error: "Invalid username or password"});
        }
        // Creates a new Session in the database with an users userId
        const newSession = await Sessions.create({userId: user._id});
        // Creates a token
        return res.status(200).json({token: newSession._id});
    } catch (e) {
        console.log(e);
        return res.status(500).json();
    }
})

// Delete a session
router.delete('/', verifyToken, async (req, res) => {
    try {
        const sessionId = req.headers.authorization.split(' ')[1];

        // Removes a session by the header with the provided sessionId
        const removedSessions = await Sessions.deleteOne({ _id: sessionId });
        res.status(200).json({ message: "Token successfully deleted" });
    } catch (err) {
        // If mongodb has an issue
        res.status(500).json({ error: "Unsuccessful" });
    }
});

module.exports = router;