const Case = require('../models/case');
const Section = require('../models/section');

// add case controller
exports.addCase = async (req, res) => {
    try {
        const { caseId, caseName, applicableSection, caseDate } = req.body;
        
        // Validate required fields
         if (!caseId || !caseName || !applicableSection || !Array.isArray(applicableSection) || applicableSection.length === 0) {
            return res.status(400).json({ msg: 'Invalid input data. Please provide all required fields.' });
        }

        // Check if case exists
        const caseExists = await Case.findOne({ caseId });
        if (caseExists) {
            return res.status(400).json({ msg: 'Case already exists' });
        }

         // Calculate case priority based on applicable sections
         casePriority = await calculatePriority(applicableSection);
        
         // Create a new case with the calculated priority
         const newCase = new Case({ caseId, caseName, applicableSection, caseDate, casePriority });
        
        // Save case to DB
        await newCase.save();
        res.status(201).json({ msg: 'Case registered successfully' });
    } catch (err) {
        if(err.message === 'Invalid Section'){
            return res.status(400).json({ msg: err.message });
          }
          return res.status(500).json({ msg: 'Server error' });
    }
};

// remove case controller
exports.deleteCase = async (req, res) => {
    try {
        const { caseId } = req.query;  // Extract 'case' from query parameters

        // Check if case exists
        const caseExists = await Case.findOne({ caseId });
        if (!caseExists) {
            return res.status(404).json({ msg: 'Case not found' });
        }

        // Delete the case
        await Case.deleteOne({ caseId });
        res.status(200).json({ msg: 'Case deleted successfully' });
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
};

// update case controller
exports.updateCase = async (req, res) => {
    try {
        const { caseId } = req.query;  // Extract 'case' from query parameters
        const { caseName, applicableSection } = req.body;  // Extract the new values from request body

        // Check if case exists
        const caseExists = await Case.findOne({ caseId });
        if (!caseExists) {
            return res.status(404).json({ msg: 'Case not found' });
        }

        caseExists.caseName = caseName || caseExists.caseName; // Fix typo here
        caseExists.applicableSection = applicableSection || caseExists.applicableSection;

        // Check if applicableSection is an array
        if (!Array.isArray(applicableSection)) {
            return res.status(400).json({ msg: 'applicableSection must be an array' });
        }

        // Calculate priority
        const casePriority = await calculatePriority(applicableSection);
        caseExists.casePriority = casePriority || caseExists.casePriority;

        // Save updated case
        await caseExists.save();
        res.status(200).json({ msg: 'Case updated successfully', case: caseExists });
    } catch (err) {
        if (err.message === 'Invalid Section') {
            return res.status(400).json({ msg: err.message });
        }
        return res.status(500).json({ msg: 'Server error' });
    }
};

// display case controller
exports.displayCases = async (req, res) => {
    try {
        
        // Retrieve all cases without sorting using MongoDB
        const cases = await Case.find();

        // Check if any cases are found
        if (cases.length === 0) {
            return res.status(404).json({ msg: 'No cases found' });
        }

        // Manually sort the cases by 'casePriority' in ascending order
        const sortedCases = cases.sort((a, b) => {
            const priorityA = a.casePriority ?? Infinity; // Handle undefined casePriority
            const priorityB = b.casePriority ?? Infinity;
            return priorityA - priorityB; // Ascending order
        });

        // Return the sorted cases in the response
        return res.status(200).json({ msg: 'Cases retrieved successfully', cases: sortedCases });
    } catch (err) {
        // Send a 500 response if there's a server error
        return res.status(500).json({ msg: 'Server error' });
    }
};



// function to retrieve section priority
const getSectionPriority = async (section) => {
    const sectionData = await Section.findOne({ section });
    // Return the priority if found, otherwise return undefined
    return sectionData ? sectionData.priority : 0; // Use 'priority' instead of 'value'
};

// function to calculate priority
const calculatePriority = async (applicableSection) => {
    let priorityArray = []

    // Fetch priorities for each section
    for (let section of applicableSection) {
        let sectionPriority = await getSectionPriority(section);
        priorityArray.push(sectionPriority)
    }
    // To remove non zero value
    for (let i = priorityArray.length - 1; i >= 0; i--) {
        if (priorityArray[i] === 0) {
            throw new Error("Invalid Section");
        }
    }

    let applicablePriority;

    if (priorityArray.length === 1) {
        // Single section, use its priority directly
        applicablePriority = priorityArray[0] || 0; // Default to 0 if section is unknown
    } else {
        // Multiple sections, calculate both average and highest priority
        const averagePriority = priorityArray.reduce((acc, priority) => acc + priority, 0) / priorityArray.length;
        const highestPriority = Math.min(...priorityArray); // Lower value means higher priority
        
        // Compare average and highest priority
        applicablePriority = Math.min(averagePriority, highestPriority);
    }
    
    return applicablePriority;
};
