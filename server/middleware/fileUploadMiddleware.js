import crypto from 'crypto';
import multer from 'multer';

const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpeg',
  'image/jpg': 'jpg',
  'image/avif': 'avif',
};

const generateId = () => crypto.randomBytes(10).toString('hex');

const fileUploadMiddleware = multer({
  limits: 500000,
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, './server/uploads/avatars');
    },

    filename: (req, file, cb) => {
      const extension = MIME_TYPE_MAP[file.mimetype];
      cb(null, generateId() + '.' + extension);
    },
  }),

  fileFilter: (req, file, cb) => {
    const isValid = !!MIME_TYPE_MAP[file.mimetype];
    const error = isValid ? null : new Error('Invalid mime type!');
    cb(error, isValid);
  },
});

export default fileUploadMiddleware;
