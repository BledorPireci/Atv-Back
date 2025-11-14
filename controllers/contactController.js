import Contact from '../models/Contact.js';

// @desc    Get contact data
// @route   GET /api/contact
// @access  Public
export const getContactContent = async (req, res) => {
  try {
    // Use lean() for better performance and select only needed fields
    let contact = await Contact.findOne().lean();
    
    // If no contact data exists, create default data
    if (!contact) {
      contact = await Contact.create({
        title: "Gati për Aventurë?",
        subtitle: "Na Kontaktoni",
        description: "Rezervoni ATV-n tuaj dhe përjetoni natyrën si kurrë më parë. Ofrojmë mjete të sigurta, profesionalizëm dhe udhërrëfyes ekspertë për një përvojë të paharrueshme.",
        stats: [
          { value: "3", label: "Modele ATV" },
          { value: "159€", label: "Nga ora" },
          { value: "24/7", label: "Rezervime" }
        ],
        contactInfo: {
          address: "Prishtinë, Kosovë",
          phone: "+383 (0) 44 123 456",
          email: "info@atvrental-ks.com",
          social: "@atvrental_ks"
        },
        workingHours: {
          weekdays: "E Hënë - E Shtunë: 08:00 - 20:00",
          sunday: "E Dielë: 09:00 - 18:00"
        }
      });
      // Convert to plain object after creation
      contact = contact.toObject();
    }
    
    // Set cache headers for static data (5 minutes cache)
    res.set('Cache-Control', 'public, max-age=300');
    
    res.status(200).json({
      success: true,
      data: contact
    });
  } catch (error) {
    console.error('Error in getContactData:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching contact data',
      error: error.message
    });
  }
};

// @desc    Update contact data
// @route   PUT /api/contact
// @access  Private/Admin
export const updateContactContent = async (req, res) => {
  try {
    const {
      title,
      subtitle,
      description,
      stats,
      contactInfo,
      workingHours
    } = req.body;

    // Validate required fields
    if (!title || !subtitle || !description) {
      return res.status(400).json({
        success: false,
        message: 'Title, subtitle, and description are required'
      });
    }

    // Validate stats array
    if (!stats || !Array.isArray(stats) || stats.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Stats array is required'
      });
    }

    // Validate contactInfo
    if (!contactInfo || !contactInfo.address || !contactInfo.phone || !contactInfo.email) {
      return res.status(400).json({
        success: false,
        message: 'Complete contact information is required'
      });
    }

    // Validate workingHours
    if (!workingHours || !workingHours.weekdays || !workingHours.sunday) {
      return res.status(400).json({
        success: false,
        message: 'Working hours information is required'
      });
    }

    // Find existing contact or create new one
    let contact = await Contact.findOne();
    
    if (contact) {
      // Update existing contact
      contact.title = title;
      contact.subtitle = subtitle;
      contact.description = description;
      contact.stats = stats;
      contact.contactInfo = contactInfo;
      contact.workingHours = workingHours;
      
      await contact.save();
    } else {
      // Create new contact
      contact = await Contact.create({
        title,
        subtitle,
        description,
        stats,
        contactInfo,
        workingHours
      });
    }

    res.status(200).json({
      success: true,
      message: 'Contact data updated successfully',
      data: contact
    });
  } catch (error) {
    console.error('Error in updateContactData:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating contact data',
      error: error.message
    });
  }
};

// @desc    Delete contact data
// @route   DELETE /api/contact
// @access  Private/Admin
// RENAMED from createContactContent to deleteContactContent
export const deleteContactContent = async (req, res) => {
  try {
    const contact = await Contact.findOneAndDelete();
    
    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact data not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Contact data deleted successfully'
    });
  } catch (error) {
    console.error('Error in deleteContactData:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting contact data',
      error: error.message
    });
  }
};

// NOTE: Updated the default export to use the new function name
export default { getContactContent, updateContactContent, deleteContactContent };