const jwt = require('jsonwebtoken')

const generateToken = (user) => {
    const token = jwt.sign({ id: user.id, username: user.username, email: user.email, role: user.role }, process.env.TOKEN_SECRET_KEY, {expiresIn: '1d'})
    return token
}

module.exports = generateToken