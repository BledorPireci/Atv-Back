import multer from 'multer';
import path from 'path';
import fs from 'fs'; 

// NDRYSHIM I RËNDËSISHËM: Përdor 'atv_images' (me poshtëvizë)
const UPLOAD_DIR = 'public/atv_images';

// --- Funksion ndihmës për të siguruar që direktoria ekziston ---
const ensureDirectoryExists = (directory) => {
    if (!fs.existsSync(directory)) {
        fs.mkdirSync(directory, { recursive: true });
        console.log(`Direktoria e re u krijua: ${directory}`);
    }
};

// --- ATV Upload Storage Configuration ---

const atvStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Sigurohuni që direktoria të ekzistojë
        ensureDirectoryExists(UPLOAD_DIR); 
        
        cb(null, UPLOAD_DIR); 
    },
    filename: (req, file, cb) => {
        // NDRYSHIMI KRYESOR: Ndrysho prefiksin nga 'atv-' në 'atvImage-'
        cb(null, `atvImage-${Date.now()}${path.extname(file.originalname)}`); // <-- KJO U NDERHY
    }
});

// ... Pjesa tjetër e kodit mbetet e njëjtë (checkFileType, atvUpload, export) ...

const checkFileType = (file, cb) => {
    const filetypes = /jpe?g|png|webp/; 
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (extname && mimetype) {
        return cb(null, true);
    } else {
        cb('Vetëm imazhet (JPEG, PNG, WEBP) janë të lejuara!', false); 
    }
};

const atvUpload = multer({
    storage: atvStorage,
    limits: { fileSize: 5000000 }, 
    fileFilter: (req, file, cb) => {
        checkFileType(file, cb);
    }
});

const uploadSingleAtvImage = atvUpload.single('atvImage'); 

export { uploadSingleAtvImage };