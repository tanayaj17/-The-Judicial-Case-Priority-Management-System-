const Section = require('../models/section');

// add section controller
exports.addSection = async (req, res) => {
    try {
        const { section, sectionName, priority } = req.body;

        // Check if section exists
        const sectionExists = await Section.findOne({ section });
        if (sectionExists) {
            return res.status(400).json({ msg: 'section already exists' });
        }

        // Create new section
        const newSection = new Section({section, sectionName, priority});

        // Save section to DB
        await newSection.save();
        res.status(201).json({ msg: 'Section registered successfully' });
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
};

// remove section controller
exports.deleteSection = async (req, res) => {
    try {
        const { section } = req.query;  // Extract 'section' from query parameters

        // Check if section exists
        const sectionExists = await Section.findOne({ section });
        if (!sectionExists) {
            return res.status(404).json({ msg: 'Section not found' });
        }

        // Delete the section
        await Section.deleteOne({ section });
        res.status(200).json({ msg: 'Section deleted successfully' });
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
};

// update section controller
exports.updateSection = async (req, res) => {
    try {
        const { section } = req.query;  // Extract 'section' from query parameters
        const { sectionName, priority } = req.body;  // Extract the new values from request body

        // Check if section exists
        const sectionExists = await Section.findOne({ section });
        
        if (!sectionExists) {
            return res.status(404).json({ msg: 'Section not found' });
        }

        // Update the section with new values
        sectionExists.sectionName = sectionName || sectionExists.sectionName;
        sectionExists.priority = priority || sectionExists.priority;

        // Save updated section
        await sectionExists.save();
        res.status(200).json({ msg: 'Section updated successfully', section: sectionExists });
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
};
