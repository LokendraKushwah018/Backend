const Employer = require("../config/db").Employer
const bcrypt = require('bcrypt');
const employer = require("../modals/employer");
const jwt = require('jsonwebtoken');
const { validationResult } = require("express-validator");
const { Sequelize } = require("sequelize")
const signup = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.errors[0].msg, status: false });
        }
        let bodyData = req.body
        let salt = bcrypt.genSaltSync(10);
        bodyData.mobile_number = parseInt(bodyData.mobile_number)
        const hashedPassword = bcrypt.hashSync(bodyData.password, salt);
        bodyData.password = hashedPassword
        // bodyData.mobile_number = parseInt(bodyData.mobile_number)
        const existingUser = await Employer.findOne({ where: { firstname: req.body.firstname } });
        const existingphone = await Employer.findOne({ where: { mobile_number: req.body.mobile_number } });
        // console.log(bodyData, "BodyData___________________--")

        if (existingUser) {
            return res.status(400).json({ message: 'Name already exists' });
        } else if (existingphone) {
            return res.status(400).json({ message: "Mobile Number already exists" })
        }
        await Employer.create(bodyData).then((response) => {
            const { password, ...removePasssword } = response.
                res.status(200).json({ status: true, message: "Employer Created Successfully", data: { response: removePasssword } })

        }).catch((error) => {
            res.status(401).json({ message: error.message, status: false });
        })

    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ message: 'User creation failed' });
    }
};

const secretKey = "testingpurposeonly"

const login = async (req, res) => {
    const { mobile_number, password } = req.body;
    const findUsers = await Employer.findOne({ where: { mobile_number: mobile_number } });
    if (!findUsers) {
        return res.status(401).json({ message: 'User not found' });
    }

    const isPasswordValid = await bcrypt.compare(password, findUsers.password);
    console.log(isPasswordValid)
    if (isPasswordValid) {
        const token = jwt.sign({ mobile_number }, secretKey);
        const { password, ...otherDatils } = findUsers.dataValues
        res.status(200).json({ status: true, data: { token, userData: otherDatils } });
    } else {
        res.status(401).json({ message: 'Authentication failed', status: false });
    }
};


const AddEmployer = async (req, res) => {
    try {
        const bodyData = req.body

        let salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(bodyData.password, salt);
        bodyData.password = hashedPassword

        const mobiledata = await Employer.findOne({
            where: { mobile_number: bodyData.mobile_number }
        })
        if (!req.file) {
            return res.status(400).json({ status: false, message: "Image is not found" })
        }

        let createData = {
            firstname: bodyData.firstname,
            mobile_number: bodyData.mobile_number,
            password: hashedPassword,
            image: req.file.filename
        }
        if (mobiledata) {
            return res.status(400).json({ status: true, message: "Mobile number already Exist" })
        } else {

            await Employer.create(createData)
            const { password, ...datavalues } = createData
            return res.status(200).json({ status: true, message: "Employer Added Successfully", data: { response: datavalues } })
        }
    } catch (error) {
        res.status(500).json({ status: false, message: error.message })
    }
}

const viewEmployer = async (req, res) => {
    const page = req.query.page || 1
    const pageSize = req.query.pageSize || 10
    const searchQuery = req.query.search
    const sortedBy = req.query.sortedBy
    const orderBy = req.query.orderBy
    try {
        const offset = (page - 1) * pageSize
        const options = {
            offset,
            limit: parseInt(pageSize)
        }
        if (searchQuery) {
            options.where = {
                [Sequelize.Op.or]: [
                    { firstname: { [Sequelize.Op.like]: `%${searchQuery}%` } },
                    { mobile_number: { [Sequelize.Op.like]: `%${searchQuery}%` } },
                ],
            };
        }

        if (sortedBy && orderBy) {
            options.order = [[sortedBy, orderBy]]
        }

        const viewdetail = await Employer.findAndCountAll(options)
        const { password, ...dataValues } = viewdetail.rows
        if (viewdetail) {
            return res.status(200).json({ status: true, message: "View Employer Detail", data: { count: viewdetail.count, response: dataValues } })

        } else {
            return res.status(400).json({ status: false, message: "No Data Available"/* , data: { response: viewdetail } */ })
        }
    } catch (error) {
        return res.status(500).json({ status: false, message: error.message })
    }
}


module.exports = { signup, login, AddEmployer, viewEmployer } 