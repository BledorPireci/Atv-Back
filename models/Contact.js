import mongoose from 'mongoose';

const contactSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    default: "Gati për Aventurë?"
  },
  subtitle: {
    type: String,
    required: true,
    default: "Na Kontaktoni"
  },
  description: {
    type: String,
    required: true
  },
  stats: [{
    value: {
      type: String,
      required: true
    },
    label: {
      type: String,
      required: true
    }
  }],
  contactInfo: {
    address: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    social: {
      type: String,
      required: true
    }
  },
  workingHours: {
    weekdays: {
      type: String,
      required: true
    },
    sunday: {
      type: String,
      required: true
    }
  }
}, {
  timestamps: true
});

// Add index for faster queries (since we always use findOne)
contactSchema.index({ createdAt: 1 });

const Contact = mongoose.model('Contact', contactSchema);

export default Contact;