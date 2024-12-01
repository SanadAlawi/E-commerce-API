const express = require('express')
const app = express()
const connectDB = require('./config/db')

app.use(express.json())

const dotenv = require('dotenv')
dotenv.config()

// RATE LIMIT
const rateLimit = require('express-rate-limit')
const UserLimit = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 3,
    message: 'Too many requests from this IP, please try again after 15 minutes'
})


// SETTING ROUTES
app.use('/api/user', require('./routes/User'))
app.use('/api/product', require('./routes/Product'))
app.use('/api/cart', require('./routes/Cart'))
app.use('/api/order', require('./routes/Order'))
app.use('/api/review', require('./routes/Review'))



// ERROR HANDLER MIDDLEWARE
const errorHandler = require('./middleware/errorHandler')
app.use(errorHandler)

const port = process.env.PORT || 4500
app.listen(port, () => {
    connectDB()
    console.log(`Server is running at ${port}`)
})