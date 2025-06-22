const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const axios = require('axios');
const User = require("../../models/user");
const { oauth2Client } = require('../../helpers/google');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET;


const registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const checkEmail = await User.findOne({ email });
    if (checkEmail) {
      return res.status(400).json({ success: false, message: "Email already exists" });
    }

    const checkUsername = await User.findOne({ username });
    if (checkUsername) {
      return res.status(400).json({ success: false, message: "Username already taken" });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email,
      password: hashPassword,
      authProvider: 'local',
      profilePic: null,
    });

    await newUser.save();

    res.status(201).json({
      success: true,
      message: "User registered successfully",
    });

  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// LOGIN
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const Checkuser = await User.findOne({ email });
    if (!Checkuser) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    const isMatch = await bcrypt.compare(password, Checkuser.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign(
      { id: Checkuser._id, name: Checkuser.username, email: Checkuser.email },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
    }).json({
      success: true,
      message: "Logged in successfully",
      user: {
        email: Checkuser.email,
        username: Checkuser.username,
        id: Checkuser._id,
      }
    });

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

// GOOGLE LOGIN
const loginWithGoogle = async (req, res) => {
  try {
    const { code } = req.body;
    if (!code) {
      return res.status(400).json({ message: "Authorization code missing." });
    }

    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    const userRes = await axios.get(
      `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${tokens.access_token}`
    );

    const { email, name, picture } = userRes.data;

    let user = await User.findOne({ email });
    if (!user) {
      user = new User({
        username: name,
        email,
        authProvider: 'google',
        profilePic: picture,
      });
      await user.save();
    }

    const token = jwt.sign(
      { id: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.cookie('token', token, {
      httpOnly: true,
      secure: false,
    });

    return res.status(200).json({
      message: "Google login successful",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        profilePic: user.profilePic,
      }
    });

  } catch (error) {
    console.error("Google login error:", error);
    return res.status(400).json({ message: "Google login failed" });
  }
};

// LOGOUT
const logoutUser = (req, res) => {
  res.clearCookie("token").json({
    success: true,
    message: "Logged out successfully!",
  });
};

// AUTH MIDDLEWARE
const authMiddleware = async (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ success: false, message: "Please login to access this resource" });
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    console.log("Authenticated user:", req.user);
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: "Invalid token" });
  }
};

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  loginWithGoogle,
  authMiddleware,
};
