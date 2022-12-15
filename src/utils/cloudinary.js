const cloudinary = require('cloudinary').v2;
const { cloud } = require('../config');

cloudinary.config({
    cloud_name: cloud.name,
    api_key: cloud.api_key,
    api_secret: cloud.api_secret,
    secure: true
})

exports.uploadImage = async (filePath) => {
    return await cloudinary.uploader.upload(filePath, { folder: 'app-movies-posters' });
}

exports.deleteImage = async (publicId) => {
    return await cloudinary.uploader.destroy(publicId);
}
