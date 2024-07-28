import {fileURLToPath} from 'url';
import {dirname} from 'path';
import multer from "multer"
import bcrypt from "bcrypt"
import nodemailer from 'nodemailer'
import {config} from '../config/config.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
//__dirname 01:05:00 (Express Avanzado Coder Class)

export default __dirname;


export const generateHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10));
export const validatePassword = (password, passwordHash) => bcrypt.compareSync(password, passwordHash);

const storage = multer.diskStorage({
  destination: function (request, file, cb) {
    cb(null, path.join(__dirname, './src/uploads'));
  },
  filename: function (request, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

export const upload = multer({ storage: storage });

const { SERVICE_NODEMAILER, PORT_NODEMAILER, USER_NODEMAILER, PASS_NODEMAILER, FROM_NODEMAILER } = config;

export const emailTransport = async (to, subject, html) => {
  const transporter = nodemailer.createTransport({
    service: SERVICE_NODEMAILER,
    port: PORT_NODEMAILER,
    auth: {
      user: USER_NODEMAILER,
      pass: PASS_NODEMAILER,
    },
  });

  return transporter.sendMail({
    from: FROM_NODEMAILER,
    to,
    subject,
    html,
  });
};

export function verifyJWT(request, response, next) {
  const token = request.cookies['codercookie'];
  if (token) {
    jwt.verify(token, SECRET, (error, decodedToken) => {
      if (error) {
        logger.debug('invalid Token:', error.message);
      } else {
        request.user = decodedToken; // returns request.user if token is valid
        logger.debug(request.user);
      }
    });
  }
  next();
}