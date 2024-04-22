import bcrypt from 'bcrypt';

import User from '../models/User.js';
import { createJwtToken } from '../utils/authMiddleware.js';

// Function to register a new user
export const registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Check if the user already exists
    let user = await User.findOne({ email }).lean();

    if (user) {
      return res.status(400).json({ msg: 'User already exists', status: 'error' });
    }

    // Create a new user instance
    user = new User({
      username,
      email,
      password,
    });

    // Encrypt the password
    const saltRounds = 10;
    user.password = await bcrypt.hash(password, saltRounds);

    // Save the user to the database
    await user.save();

    // Generate JWT token
    const token = createJwtToken(user);

    delete user.password;

    res.status(200).json({ msg: 'User registered!', jwttoken: token, user: user, status: 'ok' })
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Registration failed', status: 'error' });
  }
};

// Function to log in a user
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if the user exists
    const user = await User.findOne({ email }).lean();

    if (!user) {
      return res.status(400).json({ msg: 'Invalid credentials', status: 'error' });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials', status: 'error' });
    }

    // Generate JWT token
    const token = createJwtToken(user);

    delete user.password;

    res.status(200).json({ msg: 'User logged in correctly!', jwttoken: token, user: user, status: 'ok' })
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error', status: 'error' });
  }
};
