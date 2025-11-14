import express from 'express';
import { uploadSingleAtvImage } from '../middleware/uploadMiddleware.js';

const router = express.Router();

// Funksion ndihmës për të menaxhuar gabimet e Multer
const handleMulterError = (err, res, uploadType) => {
    console.error(`${uploadType} Upload Multer Error:`, err); 
    
    let errorMessage = `Gabim gjatë ngarkimit të fotografisë së ${uploadType}.`;
    
    if (err.code === 'LIMIT_FILE_SIZE') {
        errorMessage = `${uploadType} Fotografia është shumë e madhe (Maksimumi 5MB).`; 
    } 
    else if (typeof err === 'string' && err.includes('Only images')) {
        errorMessage = err;
    } else if (err.message) {
        errorMessage = err.message;
    }

    return res.status(400).json({ success: false, message: errorMessage });
};

// POST request handler for file uploads
router.post('/', (req, res) => {
    
    uploadSingleAtvImage(req, res, function (err) {
        
        // --- A. Handle Multer Errors for ATV ---
        if (err) {
            return handleMulterError(err, res, 'ATV');
        }
        
        // --- B. Handle Successful ATV Upload ---
        if (req.file) {
            // NDRYSHIM I RËNDËSISHËM: Kthe rrugën relative të saktë: /atv_images/emri.jpg
            // Kjo rrugë ruhet në Mongoose.
            // Përderisa server.js e ka rrugën statike tek '/public', rruga duhet të jetë pas 'public'
            const filePath = `/atv_images/${req.file.filename}`;
            
            return res.status(200).json({
                success: true,
                filePath: filePath, // KJO RUHET NË DATABAZË
                filename: req.file.filename
            });
        }
        
        // --- C. Default Error (No valid upload found) ---
        res.status(400).json({ 
            success: false, 
            message: 'Nuk u dërgua asnjë skedar me emrin "atvImage".' 
        });
    });
});

export default router;