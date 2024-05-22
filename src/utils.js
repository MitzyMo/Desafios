

    // otras validaciones
    // preguntar por adminCoder@coder.com, y la contraseña adminCod3r123
    // si son esos datos, devolves al usuario nombre "admin", email 
    // adminCoder@coder.com y rol "admin"

    import { fileURLToPath } from 'url';
    import { dirname } from 'path';
    import multer from "multer"
    import crypto from "crypto"
    import bcrypt from "bcrypt"
    
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);
    export default __dirname;
    
    const SECRET = "CoderCoder123";
    //export const generateHash = (password) => crypto.createHmac("sha256", SECRET).update(password).digest("hex");
    export const generateHash=password=>bcrypt.hashSync(password, bcrypt.genSaltSync(10))
    export const validatePassword=(password, passwordHash)=>bcrypt.compareSync(password, passwordHash)
    
    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, path.join(__dirname, './src/uploads'));
        },
        filename: function (request, file, cb) {
            cb(null, Date.now() + "-" + file.originalname);
        }
    });
    
    export const upload = multer({ storage: storage });
    