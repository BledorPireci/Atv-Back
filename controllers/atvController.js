import Atv from '../models/Atv.js';

// Default data for initialization
const defaultAtvData = [
    {
        name: 'CFORCE 1000 Overland',
        image: 'cf1000.png',
        engine: '1000CC',
        seats: 2,
        price: 159.99,
        transmission: 'Automatic', // <-- ADDED required field
        driveType: '4WD',         // <-- ADDED required field
        available: true,
        features: ['4WD', 'Automatic Transmission', 'LED Lights', 'Digital Display'],
    },
    {
        name: 'CFORCE 800 Touring',
        image: 'cf800.png',
        engine: '800CC',
        seats: 2,
        price: 139.99,
        transmission: 'Automatic', // <-- ADDED required field
        driveType: '4WD',         // <-- ADDED required field
        available: true,
        features: ['4WD', 'Automatic Transmission', 'LED Lights', 'Digital Display'],
    },
    {
        name: 'CFORCE 500',
        image: 'cf500.png',
        engine: '500CC',
        seats: 2,
        price: 119.99,
        transmission: 'Automatic', // <-- ADDED required field
        driveType: '4WD',         // <-- ADDED required field
        available: true,
        features: ['4WD', 'Automatic Transmission', 'LED Lights', 'Digital Display'],
    },
];

// @desc    Get all ATV models
// @route   GET /api/atvs
// @access  Public
export const getAtvModels = async (req, res) => {
    try {
        // Find the single document that holds all ATV models
        // Select only the atvModels field for better performance
        let atvData = await Atv.findOne().select('atvModels').lean();

        // If no document exists in the collection, create it with default data
        if (!atvData) {
            atvData = await Atv.create({ atvModels: defaultAtvData });
            // Convert to plain object after creation
            atvData = atvData.toObject();
        }

        // Set cache headers for static data (5 minutes cache)
        res.set('Cache-Control', 'public, max-age=300');

        // Return the array of ATV models contained within the document
        res.status(200).json({
            success: true,
            data: atvData.atvModels 
        });
    } catch (error) {
        console.error('Error in getAtvModels:', error);
        // CRITICAL: Always send a valid JSON response, even on error
        res.status(500).json({
            success: false,
            message: 'Server Error: Could not fetch or initialize ATV models.',
            error: error.message
        });
    }
};

// @desc    Update/Replace all ATV models
// @route   PUT /api/atvs
// @access  Private/Admin
export const updateAtvModels = async (req, res) => {
    try {
        const { atvModels } = req.body;

        if (!atvModels || !Array.isArray(atvModels)) {
            return res.status(400).json({
                success: false,
                message: 'atvModels array is required in the request body'
            });
        }
        
        // Find the single document or create it if it doesn't exist
        // $set: { atvModels } ensures we completely replace the array contents
        const atvDocument = await Atv.findOneAndUpdate(
            {}, // Query for any document (there should only be one)
            { $set: { atvModels } }, // Replace the array with the new data
            { new: true, upsert: true, runValidators: true } // Return the updated document, create if not found, run validators
        );

        res.status(200).json({
            success: true,
            message: 'ATV models updated successfully',
            data: atvDocument.atvModels
        });
    } catch (error) {
        console.error('Error in updateAtvModels:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating ATV models',
            error: error.message
        });
    }
};