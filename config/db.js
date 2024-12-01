const mongoose = require('mongoose')

const connectDB = async () => {
    try {
        const connect = await mongoose.connect(process.env.MONGOOSE_SECRET_KEY)
        console.log(`Database connected successfully`)
    } catch (error) {
        console.error(`Error: ${error.message}`)
    }
}

module.exports = connectDB