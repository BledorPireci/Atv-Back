import mongoose from 'mongoose';

// Defines the schema for a single ATV item in the array
const atvItemSchema = new mongoose.Schema({
    // NOTE: MongoDB will automatically add an _id to each item in the array
    name: {
        type: String,
        required: true
    },
    image: {
        // Storing the image filename or path/URL.
        type: String,
        required: true
    },
    engine: {
        type: String,
        required: true
    },
    seats: {
        type: Number,
        required: true,
        min: 1
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    transmission: {
        type: String,
        required: true,
        enum: ['Automatic', 'Manual', 'CVT'], // Added a common ATV transmission type
        default: 'Automatic'
    },
    driveType: {
        type: String,
        required: true,
        enum: ['2WD', '4WD', 'AWD'],
        default: '4WD'
    },
    available: {
        type: Boolean,
        required: true,
        default: true
    },
    features: [{
        type: String
    }],
});

// Defines the schema for the collection. 
// It will contain only one document which holds the 'atvModels' array.
const atvSchema = new mongoose.Schema({
    // An array to hold all your ATV models
    atvModels: [atvItemSchema]
}, {
    timestamps: true
});

// Add index for faster queries (since we always use findOne)
atvSchema.index({ createdAt: 1 });

const Atv = mongoose.model('Atv', atvSchema);

export default Atv;