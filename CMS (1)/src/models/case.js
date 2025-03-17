const mongoose = require('mongoose');

const caseSchema = new mongoose.Schema({
    caseId: {
        type: Number,
        required: true,
        unique: true
    },
    caseName: {
        type: String,
        required: true
    },
    applicableSection: {
        type: [String],
        required: true
    },
    caseDate: {
        type: String,
        required: true
    },
    casePriority: {
        type: Number,
        required: true
    },
});

const Case = mongoose.model('Case', caseSchema);

module.exports = Case;
