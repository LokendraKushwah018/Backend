const multer = require("multer")

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/uploads')
    },
    filename: function (req, file, cb) {
        console.log(file.originalname, 'jklj')
        cb(null, file.originalname + "-" + Date.now() + ".jpg")
    }
})
var upload = multer({ storage: storage })

module.exports = { upload }