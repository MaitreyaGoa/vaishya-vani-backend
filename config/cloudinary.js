// config/cloudinary.js
// Cloudinary connection — used to store business logos and matrimony photos.
// Sign up free at https://cloudinary.com — your Cloud Name, API Key, and API Secret
// are shown right on your Cloudinary dashboard after signup.

const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

module.exports = cloudinary;
