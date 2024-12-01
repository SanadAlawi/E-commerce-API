const Joi = require('joi')


const typeField = (fieldName, type = 'text') => {
    return `${fieldName} should be a type of ${type}`
}
const requiredField = (fieldName) => {
    return `${fieldName} is a required field`
}


const registerSchema = Joi.object({
    username: Joi.string()
        .required()
        .min(6)
        .messages({
            'string.base': typeField('Username'),
            'string.empty': 'Username cannot be an empty field',
            'string.min': 'Username should have a minimum length of 6',
            'any.required': requiredField('Username')
        }),

    email: Joi.string()
        .email()
        .required()
        .messages({
            'string.base': typeField('Email'),
            'string.email': 'Email must be a valid email address',
            'any.required': requiredField('Email')
        }),

    password: Joi.string()
        .required()
        .min(8)
        .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$'))
        .messages({
            'string.pattern.base': 'Password  must have at least 8 characters, including one uppercase letter, one lowercase letter, one digit, and one special character',
            'string.min': 'Password should have a minimum length of 8',
            'any.required': requiredField('Password')
        })
})


const loginSchema = Joi.object({
    username: Joi.string()
        .optional()
        .min(6)
        .messages({
            'string.base': typeField('Username'),
            'string.empty': 'Username cannot be an empty field',
            'string.min': 'Username should have a minimum length of 6',
            'any.required': requiredField('Username')
        }),

    email: Joi.string()
        .email()
        .optional()
        .messages({
            'string.base': typeField('Email'),
            'string.email': 'Email must be a valid email address',
            'any.required': requiredField('Email')
        }),

    password: Joi.string()
        .required()
        .min(8)
        .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$'))
        .messages({
            'string.pattern.base': 'Password  must have at least 8 characters, including one uppercase letter, one lowercase letter, one digit, and one special character',
            'string.min': 'Password should have a minimum length of 8',
            'any.required': requiredField('Password')
        })
}).xor('username', 'email')


const userSchema = Joi.object({
    username: Joi.string()
        .optional()
        .min(6)
        .messages({
            'string.base': typeField('Username'),
            'string.empty': 'Username cannot be an empty field',
            'string.min': 'Username should have a minimum length of 6',
            'any.required': requiredField('Username')
        }),

    email: Joi.string()
        .email()
        .optional()
        .messages({
            'string.base': typeField('Email'),
            'string.email': 'Email must be a valid email address',
            'any.required': requiredField('Email')
        })
})

const productSchema = Joi.object({
    name: Joi.string()
        .required()
        .messages({
            'string.base': typeField('Name'),
            'string.required': requiredField('Name')
        }),
    description: Joi.string()
        .required()
        .messages({
            'string.base': typeField('Description'),
            'string.required': requiredField('Description')
        }),
    price: Joi.number()
        .required()
        .positive()
        .messages({
            'number.base': typeField('Description'),
            'number.required': requiredField('Description')
        }),
    stock: Joi.number()
        .positive()
        .default(0),
    category: Joi.string()
        .required()
        .messages({
            'string.base': typeField('Category'),
            'string.required': requiredField('Category')
        }),
    imageUrl: Joi.string()
        .optional()
})

const productUpdateSchema = Joi.object({
    name: Joi.string()
        .optional()
        .messages({
            'string.base': typeField('Name'),
            'string.required': requiredField('Name')
        }),
    description: Joi.string()
        .optional()
        .messages({
            'string.base': typeField('Description'),
            'string.required': requiredField('Description')
        }),
    price: Joi.number()
        .optional()
        .positive()
        .messages({
            'number.base': typeField('Description'),
            'number.required': requiredField('Description')
        }),
    stock: Joi.number()
        .positive()
        .default(0),
    category: Joi.string()
        .optional()
        .messages({
            'string.base': typeField('Category'),
            'string.required': requiredField('Category')
        }),
    imageUrl: Joi.string()
        .optional()
})

const objectIdRegex = /^[a-fA-F0-9]{24}$/;

const objectIdSchema = Joi.string()
    .required()
    .pattern(objectIdRegex, 'MongDB objectId')
    .messages({
        'string.pattern.name': 'Invalid MongoDB ObjectId format. It must be a 24-character hexadecimal string.',
        'string.required': requiredField('Object ID')
    })

const cartSchema = Joi.object({
    productId: Joi.string()
        .required()
        .pattern(objectIdRegex, 'MongDB objectId')
        .messages({
            'string.pattern.name': 'Invalid MongoDB ObjectId format. It must be a 24-character hexadecimal string.',
            'string.required': requiredField('Product ID')
        }),
    quantity: Joi.number()
        .positive()
        .required()
        .messages({
            'string.base': typeField('Quantity', 'number'),
            'string.required': requiredField('Quantity')
        })

})

const orderSchema = Joi.object({
    shippingAddress: Joi.string()
        .required()
        .messages({
            'string.base': typeField('Shipping Address'),
            'string.required': requiredField('Shipping Address')

        }),
    paymentMethod: Joi.string()
        .required()
        .valid('credit_card', 'paypal', 'cash_on_delivery')
        .messages({
            'string.base': typeField('Payment Method'),
            'any.required': requiredField('Payment Method'),
            'any.only': 'Payment Method must be one of the following: Credit Card, PayPal, Cash On Delivery'
        })
})

const orderStatusSchema = Joi.string()
    .required()
    .valid('pending', 'shipped', 'delivered', 'cancelled')
    .messages({
        'string.base': typeField('Status'),
        'any.required': requiredField('Status'),
        'any.only': 'Status must be one of the following: Pending, Shipped, Delivered, Cancelled'
    })

const orderQuerySchema = Joi.object({

    status: Joi.string()
        .optional()
        .valid('pending', 'shipped', 'delivered', 'cancelled')
        .messages({
            'string.base': `"status" must be a number`,
            'string.string': `"status" must be a text`,
            'any.only': 'Status must be one of the following: Pending, Shipped, Delivered'
        }),
    page: Joi.number()
        .optional()
        .positive()
        .min(1)
        .default(1)
        .messages({
            'number.base': `"page" must be a number`,
            'number.integer': `"page" must be a positive integer`,
            'number.min': `"page" must be greater than or equal to 1`,
        }),
    limit: Joi.number()
        .optional()
        .positive()
        .min(1)
        .default(10)
        .messages({
            'number.base': `"limit" must be a number`,
            'number.integer': `"limit" must be a positive integer`,
            'number.min': `"limit" must be greater than or equal to 1`,
        }),
    startDate: Joi.date()
        .iso()
        .optional()
        .messages({
            'date.base': `"startDate" must be a valid date`,
            'date.format': `"startDate" must be in the format YYYY-MM-DD`,
        }),
    endDate: Joi.date()
        .iso()
        .optional()
        .messages({
            'date.base': `"endDate" must be a valid date`,
            'date.format': `"endDate" must be in the format YYYY-MM-DD`,
        })
})



const reviewSchema = Joi.object({
    rating: Joi.number()
        .positive()
        .required()
        .max(5)
        .min(1)
        .messages({
            'number.base': typeField('Rating', 'number'),
            'number.positive': 'Rating must be a positive number',
            'number.max': 'Rating must be less than or equal to 5',
            'number.min': 'Rating must be greater than or equal to 1',
            'any.required': requiredField('Rating')
        }),

    comment: Joi.string()
        .optional()
        .messages({
            'string.base': typeField('Comment'),
        })
})

module.exports = { registerSchema, loginSchema, userSchema, productSchema, productUpdateSchema, cartSchema, orderSchema, orderQuerySchema, orderStatusSchema, reviewSchema, objectIdSchema }