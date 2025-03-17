const User = require('../models/user');
const bcrypt = require('bcryptjs');

// Register Controller
exports.register = async (req, res) => {
    try {
        const { username, password, userType } = req.body;
        console.log(req.body)
        // Check if user exists
        const userExists = await User.findOne({ username });

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        if (userExists) {
            // Update existing user's details
            userExists.password = hashedPassword;
            userExists.userType = userType;

            // Save the updated user details
            await userExists.save();
            return res.status(200).json({ msg: 'User details updated successfully' });
        }

        // If user does not exist, create new user
        const newUser = new User({
            username,
            password: hashedPassword,
            userType
        });

        // Save the new user to the database
        await newUser.save();
        res.status(201).json({ msg: 'User registered successfully' });
    } catch (err) {
        console.log(err);
        
        res.status(500).json({ msg: 'Server error' });
    }
};

// Login Controller

exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;
        // Check if user exists
        const user = await User.findOne({ username });
        if (!user || (user.userType != req.body.userType)) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }
        
        res.status(200).json({ msg: 'Login successful' });
        
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
};
