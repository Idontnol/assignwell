const cloudinary = require('cloudinary').v2;
require('dotenv').config();
console.log(process.env.CLOUD_NAME,"cloud")
console.log(process.env.CLOUD_API_KEY,"cloud api key")
console.log(process.env.CLOUD_API_SECRET,"cloud secret")

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
    secure:true
});

module.exports = cloudinary;
