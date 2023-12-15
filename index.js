const express = require('express')
require('./config/db');
const app = express()
var router = express.Router();
const controller = require('./Controller/index')
const transaction = require('./Controller/transaction')
const custom = require('./Controller/custom')
const Employer = require('./Controller/employer');
// const { SignupValidation } = require('./Middleware/Validator/AuthValidator');
const { Authtoken } = require('./Middleware/TokenAuthorization');
const { SignupValidation } = require('./Middleware/Validator/AuthValidator');
const { upload } = require('./Middleware/ImageMulter/Image');
const transactiondata = require('./modals/transactiondata');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.send('Hey!!')
})

app.post('/signup', controller.signup)
app.post('/login', controller.login)
app.get('/getUser', Authtoken, controller.usercount)
app.post('/updateUser', Authtoken, controller.UpdateUser)
app.post('/deleteUser/:id', Authtoken, controller.DeleteUser)
app.post('/AddUser', Authtoken, controller.AddUser)


app.post('/transaction', Authtoken, transaction.Addtransaction)
app.get('/gettransaction', Authtoken, transaction.GetTransaction);
app.post('/edittransaction/:id', Authtoken, transaction.Edittransaction)

// app.get('/gettransaction/:userId', Authtoken, transaction.GetTransaction);

app.post('/customsignup', custom.signup)
app.post('/customlogin', custom.login)
app.get('/getAllcustom', custom.customAllcount)
app.post('/updateCustom', custom.updateCustomUser)
app.post('/delete_custom/:id', custom.DeleteCustom)


app.post('/employersignup', SignupValidation, Employer.signup)
app.post('/employerlogin', Employer.login)
app.post('/addemployer', Authtoken, upload.single('image'), Employer.AddEmployer)
app.get('/viewemployer', Authtoken, Employer.viewEmployer)
// module.exports = router ;


app.listen(5000, () => {
    console.log("Connected to Server")
})