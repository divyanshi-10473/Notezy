const express = require('express');

const {authMiddleware} = require('../controllers/auth-controller/index.js');
const { createChat, getChats, addConversation, getConversations, deleteChat } = require('../controllers/chat-controller');

const router = express.Router();

router.post('/new',authMiddleware,  createChat);
router.get('/all',authMiddleware,  getChats);
router.post('/add/:id',authMiddleware,  addConversation);
router.get('/get/:id',authMiddleware,  getConversations);
router.delete('/delete/:id',authMiddleware,  deleteChat);



module.exports = router;
