const User = require("./models/User")

const findByUsernameOrEmail = async (username, email) => {
    const user = await User.findOne({
        $or: [
            { username: username },
            { email: email },
        ]
    })
    return user
}

module.exports = { findByUsernameOrEmail }