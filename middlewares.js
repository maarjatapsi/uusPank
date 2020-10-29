const mongoose = require('mongoose');
const sessionModel = require('./models/Session');

exports.RequestBodyIsValidJson = (err, req, res, next) => {

    // body-parser will set this to 400 if the json is in error
    if (err.status === 400)
        return res.status(err.status).send('Malformed JSON');
    return next(err);
}

exports.RequestHeadersHaveCorrectContentType = (req, res, next) => {

    // Catch invalid Content-Types
    var RE_CONTYPE = /^application\/(?:x-www-form-urlencoded|json)(?:[\s;]|$)/i;
    if (req.method !== 'GET' && !RE_CONTYPE.test(req.headers['content-type'])) {
        res.setStatus = 406
        return res.send('Content-Type is not application/json');
    }
    next();
}

exports.verifyToken = async(req, res, next) => {

    // Check Authorization header is provided
    let authorizationHeader = req.header('Authorization')
    if (!authorizationHeader) {
        return res.status(401).json({ error: 'Missing Authorization header' })
    }

    // Split Authorization header into an array (by spaces)
    authorizationHeader = authorizationHeader.split(' ')

    // Check Authorization header from token
    if (!authorizationHeader[1]) {
        return res.status(400).json({ error: 'Invalid Authorization header format' })
    }

    // Validate token is in mongo ObjectId format to prevent UnhandledPromiseRejectionWarnings
    if (!mongoose.Types.ObjectId.isValid(authorizationHeader[1])) {
        return res.status(401).json({ error: 'Invalid token' })
    }

    const session = await sessionModel.findOne({ _id: authorizationHeader[1] });
    if (!session) return res.status(401).json({ error: 'Invalid token' });

    // Write user's id into req
    req.userId = session.userId
    return next(); // Pass the request to the next middleware
}