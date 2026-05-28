import multer from 'multer';
import path from 'path';
import fs from 'fs';

// check if the directory exists
const uploadDir = 'public/uploads';
if(!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// configure multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
      cb(null, uploadDir); // folder where the files will be stored
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname)); // Unique name
  }
});

// Filter file for images
const fileFilter = (req, file, cb )
