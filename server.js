import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import compression from 'compression';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './config/db.js';
import atvRoutes from './routes/atvRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import userRoutes from './routes/authRoutes.js';
import contactRoutes from './routes/contactRoutes.js'; 

dotenv.config();
connectDB();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- Middleware ---
app.use(cors());
// Add compression middleware to reduce response sizes
app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use('/public', express.static(path.join(__dirname, 'public')));


// --- API Routes ---
app.use('/api/atvs', atvRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/auth', userRoutes); 
app.use('/api/contact', contactRoutes); 

if (process.env.NODE_ENV === 'production') {
} else {
     app.get('/', (req, res) => {
     res.send('API is running in development mode...');
     });
}

app.use((err, req, res, next) => {
    console.error(err.stack);
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode).json({
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
});


const PORT = process.env.PORT || 5000;

app.listen(
    PORT,
    '0.0.0.0',
    () => {
        console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
    }
);