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
        console.log(err)
        if (err) return res.sendStatus(403)
        req.user = user
        next()
    })
}

const generateJWTToken = (userData) => {
    return jwt.sign(JSON.stringify(userData), process.env.JWT_SECRET);
}

module.exports = {
    authenticateToken,
    generateJWTToken
}