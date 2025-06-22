const express = require('express');
const router = express.Router();
const { registerUser, loginUser, logoutUser, authMiddleware, loginWithGoogle  } = require('../controllers/auth-controller/index');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/google-login', loginWithGoogle);
router.post('/logout', logoutUser);
router.get('/check-auth', authMiddleware, (req, res) => {
    const user= req.user;
    res.status(200).json({
        success: true,
        message: "User is authenticated",
        user,
    });
});

module.exports = router;
