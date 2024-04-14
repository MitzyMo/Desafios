import { fileURLToPath } from 'url';
import { dirname } from 'path';
import multer from "multer"

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default __dirname;

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null,path.join(__dirname, './src/uploads') )
    },
    filename: function (req, file, cb) {
        // const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        // cb(null, file.fieldname + '-' + uniqueSuffix)
        //Giving unique name to files
        cb(null, Date.now() +"-"+file.originalname )

    }
})

export const upload = multer({ storage: storage })