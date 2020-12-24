const jwt = require('jsonwebtoken')
const authenticateToken = (req, res, next) => {
    // Gather the jwt access token from the request header
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1] || req.cookies.token
    if (token == null) {
        res.status(401)
        return res.send('Logged out!')
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403)
        req.user = user
        next()
    })
}

const generateJWTToken = (userData) => {
    let data = {
        username: userData.username,
        password: userData.password,
        _id: userData._id
    }
    return jwt.sign(JSON.stringify(data), process.env.JWT_SECRET);
}

module.exports = {
    authenticateToken,
    generateJWTToken
}