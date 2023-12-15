const { check } = require('express-validator');

const SignupValidation = [
    check("firstname").notEmpty().withMessage('Name is required').isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters'),
    // check("email").notEmpty().withMessage("Email is required").notEmpty().withMessage('Email is required').isEmail().withMessage('Invalid email format'),
    // check("city").notEmpty().withMessage("City is required"),
    check("mobile_number").notEmpty().withMessage("Phone is required").notEmpty().withMessage('Phone is required').isNumeric().withMessage('Phone must contain only numeric characters'),
    check("password").notEmpty().withMessage("Password is required").notEmpty()

]
module.exports = { SignupValidation }