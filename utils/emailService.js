const transporter = require('../config/email')
const logger = require('../config/Logger')
const fs = require('fs')
const handlebar = require('handlebars')


const sendEmail = async (to, subject, data, fileTemplate, next) => {
    try {
        
        const source = fs.readFileSync(__dirname + `/../templates/${fileTemplate}.html`, 'utf8')
        const template = handlebar.compile(source)
        const html = template(data)

        const email = await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to,
            subject,
            html
        })
        logger.info('Email send successfully')
    } catch (error) {
        next(error)
    }
}


module.exports = sendEmail