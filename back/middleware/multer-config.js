const multer = require('multer');
const pool = require('../middleware/database');

const MIME_TYPES = {
    'image/jpg': 'jpg', 'image/jpeg': 'jpg', 'image/png': 'png'
};

const storage = multer.diskStorage({
    
    destination: (req, file, callback) => {
        callback(null, 'images');
    }, 
    filename: (req, file, callback) => {
        const extension = MIME_TYPES[file.mimetype];
        let name = file.originalname.split(' ').join('_');
        if (Object.values(MIME_TYPES).includes(name.split('.').pop()) === true) {
            name = name.slice(0, name.lastIndexOf('.'));
        }
        file.filename = name + '.' + Date.now() + '.' + extension;
        callback(null, file.filename);
    }                   
});  

module.exports = multer({storage: storage}).single('image');