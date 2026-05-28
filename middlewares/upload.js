import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { error } from 'console';

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
const fileFilter = (req, file, cb ) => {
  const filetypes = /jpeg|jpg|png/;
  const mimetype = filetypes.test(file.mimetype);
  const extname = filetypes.test(path.extname(file.originalname).toLocaleLowerCase());

  if(mimetype && extname) {
    return cb(null, true)
  }
  cb(new error('The file should be a image -> jpeg, jpg or png'));
}

const upload = multer({ storage, fileFilter})

export default upload;
