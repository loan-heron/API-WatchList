const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const multer = require('multer');

const imagesDirectory = path.join(__dirname, '..', 'images');

fs.mkdirSync(imagesDirectory, { recursive: true });

const storage = multer.diskStorage({
  destination(req, file, callback) {
    callback(null, imagesDirectory);
  },
  filename(req, file, callback) {
    const extension = path.extname(file.originalname).toLowerCase();
    const randomName = crypto.randomBytes(12).toString('hex');
    callback(null, `${Date.now()}-${randomName}${extension}`);
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter(req, file, callback) {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

    if (!allowedTypes.includes(file.mimetype)) {
      const error = new Error('Le fichier doit etre une image JPEG, PNG, WEBP ou GIF');
      error.status = 400;
      return callback(error);
    }

    callback(null, true);
  },
});

module.exports = {
  uploadImage: upload.single('image'),
};
