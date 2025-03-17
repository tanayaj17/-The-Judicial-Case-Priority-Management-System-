const mongoose = require('mongoose');

const sectionSchema = new mongoose.Schema({
    section: {
        type: String,
        required: true,
        unique: true
    },
    sectionName: {
        type: String,
        required: true,
    },
    priority: {
        type: Number,
        required: true
    }
});

const Section = mongoose.model('Section', sectionSchema);

module.exports = Section;
