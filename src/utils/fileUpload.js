const fileUpload = require('express-fileupload');

exports.upload = fileUpload({
    useTempFiles: true,
    tempFileDir: './server/tmp'
})
