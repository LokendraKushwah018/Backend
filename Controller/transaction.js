const { transaction, user } = require("../config/db");

const Addtransaction = async (req, res) => {
    try {
        const userDetail = req.userdata.id
        const bodyData = req.body

        const data = {
            username: bodyData.username,
            amount: bodyData.amount,
            userId: userDetail
        }
        console.log(data, "data")
        await transaction.create(data)
        return res.status(200).json({ status: true, message: "User Transaction Added Successfully" })
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error', status: false });
    }
}

const Edittransaction = async (req, res) => {
    try {
        const userDetail = req.userdata.id
        const userId = req.params.id;
        const bodyData = req.body
        const databyuserid = await transaction.findOne
            ({ where: { id: userId } })


        const data = {
            username: bodyData.username || databyuserid.username,
            amount: bodyData.amount || databyuserid.amount,
            userId: userDetail
        }
        // console.log(databyuserid, "_______________________", userId, "userID", "===========", userDetail)
        // const whereClause = {
        //     where: {
        //         id: bodyData.id
        //     }
        // };
        if (!databyuserid) {
            return res.status(400).json({ status: false, message: "Transaction ID Does not Exist" })
        }
        await databyuserid.update(data)
        return res.status(200).json({ status: true, message: "User Transaction Edit Successfully" })
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message /*  'Internal Server Error' */, status: false });
    }
}

// const GetTransaction = async (req, res) => {
//     try {
//         const getusers = await user.findAndCountAll({
//             include: [
//                 {
//                     model: transaction,
//                     as: 'transaction',
//                     attributes: ['id', 'username', 'amount'],
//                 }
//             ],
//         })

//         if (getusers) {
//             res.status(200).json({ status: true, data: { count: getusers.count, rows: getusers.rows } })
//         } else {
//             res.status(401).json({ message: 'Data Not Found', status: false });
//         }

//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Internal Server Error', status: false });
//     }
// }



// const GetTransaction = async (req, res) => {
//     try {
//         const getusers = await user.findAndCountAll({
//             // attributes: { exclude: ['createdAt', 'updatedAt'] },
//             include: [
//                 {
//                     model: transaction,
//                     as: 'transaction',
//                     attributes: ['id', 'username', 'amount'],
//                 }
//             ],
//         });

//         if (getusers) {
//             const sanitizedData = getusers.rows.map(user => {
//                 const { password, ...otherDetails } = user.get();
//                 return {
//                     ...otherDetails,
//                     transaction: user.transaction.map(transaction => ({
//                         id: transaction.id,
//                         username: transaction.username,
//                         amount: transaction.amount,
//                     }),
//                     )
//                 };
//             });

//             return res.status(200).json({ status: true, data: { count: getusers.count, rows: sanitizedData } });
//         } else {
//             res.status(401).json({ message: 'Data Not Found', status: false });
//         }

//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Internal Server Error', status: false });
//     }
// }


const GetTransaction = async (req, res) => {
    // const userId = req.params.userId;
    const userDetail = req.userdata.id

    try {
        // const userTransaction = await user.findByPk(userId, {
        const databyuserid = await transaction.findAndCountAll({ where: { userId: userDetail } })
        const userTransaction = await user.findOne({
            where: { id: userDetail },
            include: [
                {
                    model: transaction,
                    as: 'transaction',
                    attributes: ['id', 'username', 'amount'],
                }
            ],
        });
        // console.log(databyuserid, "databyuserid ____________________________")
        if (userTransaction) {
            const { password, ...otherDetails } = userTransaction.get();

            return res.status(200).json({ status: true, TransactionCount: databyuserid.count, data: otherDetails });
        } else {
            res.status(404).json({ message: 'User Not Found', status: false });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error', status: false });
    }
}


module.exports = { Addtransaction, GetTransaction, Edittransaction }