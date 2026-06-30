// middleware/upload.js
// Handles incoming image files (business logo, matrimony photo, horoscope) using
// multer (in-memory) then streams them up to Cloudinary. Images are NOT stored
// on the server's own disk — Render's free tier wipes local files on every
// restart, so Cloudinary is the permanent home for all uploaded images.

const multer = require('multer');
const cloudinary = require('../config/cloudinary');

// Store the file in memory temporarily, just long enough to forward it to Cloudinary
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max per image
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  },
});

// Helper: upload a single in-memory file buffer to Cloudinary, returns {url, public_id}
function uploadToCloudinary(fileBuffer, folder) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: `vaishya-vani-parivar/${folder}` },
      (error, result) => {
        if (error) return reject(error);
        resolve({ url: result.secure_url, public_id: result.public_id });
      }
    );
    stream.end(fileBuffer);
  });
}

module.exports = { upload, uploadToCloudinary };
