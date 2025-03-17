const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/userController');
const { addSection, deleteSection, updateSection } = require('../controllers/sectionController');
const { addCase, deleteCase, updateCase, displayCases} = require('../controllers/caseController');

// Register Route
router.post('/register', register);

// Login Route
router.post('/login', login);

//Add Section Route
router.post('/add-section', addSection);

//delete Section Route
router.delete('/delete-section', deleteSection);

//Update Section Route
router.put('/update-section', updateSection);

//Add Case Route
router.post('/add-case', addCase);

//delete Case Route
router.delete('/delete-case', deleteCase);

//Update Case Route
router.put('/update-case', updateCase);

//Case Priority Management Route
router.get('/case-priority', displayCases);

module.exports = router;
