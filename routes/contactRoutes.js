import express from 'express';
import {
getContactContent,
updateContactContent,
deleteContactContent 
} from '../controllers/contactController.js';

const router = express.Router();
router.get('/', getContactContent); 
router.put('/', updateContactContent); 
router.delete('/', deleteContactContent); 

export default router;