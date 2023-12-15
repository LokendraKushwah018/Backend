const jwt = require('jsonwebtoken');
const custom = require('../config/db').custom
const bcrypt = require('bcrypt');



const signup = async (req, res) => {
    try {
        let bodyData = req.body
        bodyData.mobile_number = parseInt(bodyData.mobile_number)
        const Aadharcheck = await custom.findOne({ where: { aadhar_card: req.body.aadhar_card } })
        if (Aadharcheck) {
            return res.status(400).json({ message: 'Aadhar Number Already Exists' });
        } else {
            // console.log("req.bodyCreateCustomdata", bodyData)
            await custom.create(bodyData).then((response) => {
                res.status(200).json({ status: true, message: "Custom Created Successfully", data: { response: response } })
            }).catch((error) => {
                res.status(401).json({ message: error.message, status: false });
            })
        }
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Internal Server Error', error: error.message, status: false });
    }
}

const login = async (req, res) => {
    try {

        // res.json({ status: true, message: "Logged in successfull", data: { rows: [], count: null })

        const { firstname, mobile_number } = req.body

        const data = await custom.findOne({ where: { firstname: firstname } })
        if (!data) {
            return res.status(401).json({ message: 'User not found' });
        }
        if (mobile_number && mobile_number !== data.mobile_number) {
            const data_Mobile_number = await custom.findOne({ where: { mobile_number: parseInt(mobile_number) } })
            if (!data_Mobile_number) {
                return res.status(400).json({ message: 'Mobile number already exists' });
            }
        }
        return res.status(200).json({ status: true, data: { rows: data } })

    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Internal Server Error', error: error.message, status: false });
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

const updateCustomUser = async (req, res) => {
    try {
        const { id, firstname, lastname, aadhar_card, pan_card, mobile_number } = req.body
        if (id) {
            const userid = await custom.findOne({ where: { id } })
            if (!userid) {
                res.status(400).json({ message: 'Custom Not found' })
            }
            if (mobile_number && mobile_number !== userid.mobile_number) {
                const data_Mobile_number = await custom.findOne({ where: { mobile_number: parseInt(mobile_number) } })
                if (data_Mobile_number) {
                    return res.status(400).json({ message: 'Mobile number already exists' });
                }
            }

            await custom.update({
                firstname: firstname || userid.firstname,
                lastname: lastname || userid.lastname,
                aadhar_card: aadhar_card || userid.aadhar_card,
                pan_card: pan_card || userid.pan_card,
                mobile_number: mobile_number || userid.mobile_number
            }, {
                where: { id: id }
            })
            res.status(200).json({ message: "Custom Updated Successfully" })
        }
    } catch (error) {
        res.status(500).json({ message: error.message, status: false });
    }
}

const DeleteCustom = async (req, res) => {
    try {
        const { id } = req.params
        if (id) {
            const customDelete = await custom.destroy({ where: { id: id } })
            if (customDelete) {
                res.status(201).json({ message: 'Custom Deleted Successfully' });

            } else {
                res.status(400).json({ message: 'Custom Not found' })
            }

        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error', status: false });
    }
}

module.exports = { signup, login, customAllcount, updateCustomUser, DeleteCustom }

