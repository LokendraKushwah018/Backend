const jwt = require('jsonwebtoken');
const user = require('../config/db').user;
const bcrypt = require('bcrypt');

const signup = async (req, res) => {
    try {

        let bodyData = req.body
        let salt = bcrypt.genSaltSync(10);

        const hashedPassword = bcrypt.hashSync(bodyData.password, salt);
        bodyData.password = hashedPassword
        // bodyData.mobile_number = parseInt(bodyData.mobile_number)
        const existingUser = await user.findOne({ where: { email: req.body.email } });
        const existingphone = await user.findOne({ where: { mobile_number: req.body.mobile_number } });

        if (existingUser) {
            return res.status(400).json({ message: 'Email already exists' });
        } else if (existingphone) {
            return res.status(400).json({ message: "Mobile Number already exists" })
        }
        await user.create(bodyData)

        res.status(200).json({ message: 'User created successfully' });
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ message: 'User creation failed' });
    }
};
const secretKey = "testingpurposeonly"

const login = async (req, res) => {
    const { email, password } = req.body;
    const findUsers = await user.findOne({ where: { email: email } });
    if (!findUsers) {
        return res.status(401).json({ message: 'User not found' });
    }

    const isPasswordValid = await bcrypt.compare(password, findUsers.password);
    console.log(isPasswordValid)
    if (isPasswordValid) {
        const token = jwt.sign({ userID: findUsers.id }, secretKey);
        const { password, ...otherDatils } = findUsers.dataValues
        res.status(200).json({ status: true, data: { token, userData: otherDatils } });
    } else {
        res.status(401).json({ message: 'Authentication failed', status: false });
    }
};

const usercount = async (req, res) => {
    try {
        const getAllUsers = await user.findAndCountAll({})
        const token = req.headers.authorization;

        if (getAllUsers) {
            res.status(200).json({ status: true, data: { count: getAllUsers.count, rows: getAllUsers.rows } });
        } else {
            res.status(401).json({ message: 'Data Not Found', status: false });
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error', status: false });
    }

}

const UpdateUser = async (req, res) => {
    try {
        const { id, firstname, lastname, email, mobile_number } = req.body;

        if (id) {
            const existingUser = await user.findOne({ where: { id } });
            if (!existingUser) {
                return res.status(404).json({ message: 'User not found' });
            }
            if (mobile_number && mobile_number !== existingUser.mobile_number) {
                const userWithMobileNumber = await user.findOne({ where: { mobile_number } });
                if (userWithMobileNumber) {
                    return res.status(400).json({ message: 'Mobile number already exists' });
                }
            }
            await user.update(
                {
                    firstname: firstname || existingUser.firstname,
                    lastname: lastname || existingUser.lastname,
                    email: email || existingUser.email,
                    mobile_number: mobile_number || existingUser.mobile_number,
                },
                {
                    where: {
                        id: id
                    }
                }
            );
            res.status(201).json({ message: 'User updated successfully' });
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const DeleteUser = async (req, res) => {
    try {
        const { id } = req.params
        if (id) {
            const DeleteUsers = await user.destroy({ where: { id: id } })
            if (DeleteUsers) {
                console.log('User deleted');
                res.status(201).json({ message: 'User deleted successfully', status: true });
            } else {
                res.status(400).json({ message: 'User Not found' });
            }
        }

    } catch {
        res.status(500).json({ message: 'Internal Server Error', status: false });
    }
}

const customAllcount = async (req, res) => {
    try {
        const GetAllcustom = await custom.findAndCountAll({
            attributes: { exclude: ['createdAt', 'updatedAt'] },
        })
        if (GetAllcustom) {
            res.status(200).json({ status: true, data: { count: GetAllcustom.count, rows: GetAllcustom.rows } })
        } else {
            res.status(401).json({ message: 'Data Not Found', status: false });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error', status: false });
    }
}

const AddUser = async (req, res) => {
    const bodyData = req.body
    const CheckuserEmail = await user.findOne({ where: { email: bodyData.email } })
    const CheckuserNumber = await user.findOne({ where: { mobile_number: bodyData.mobile_number } })

    if (CheckuserEmail) {
        return res.status(400).json({ status: false, message: "Email ID already Exist" })
    } else if (CheckuserNumber) {
        return res.status(400).json({ status: false, message: "Mobile Number already Exist" })
    } else {
        let dataUser = ({
            firstname: bodyData.firstname,
            lastname: bodyData.lastname,
            email: bodyData.email,
            mobile_number: bodyData.mobile_number,
            password: bodyData.password
        })
        await user.create(dataUser)
        return res.status(200).json({ status: true, message: "User Added Successfully" })
    }
}

module.exports = { signup, login, usercount, UpdateUser, DeleteUser, customAllcount, AddUser }

