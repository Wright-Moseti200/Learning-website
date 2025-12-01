const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'learning-platform',
    resource_type: 'auto', // auto-detect image or video
    allowed_formats: ['jpg', 'png', 'jpeg', 'gif', 'mp4', 'mov', 'pdf', 'doc', 'docx', 'zip'],
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 1024 * 10 }, // 10GB
});

module.exports = upload;