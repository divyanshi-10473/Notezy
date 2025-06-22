const { callGeminiAPI } = require("../../helpers/chatbot");
const Chat = require("../../models/chat");
const Conversation= require( "../../models/conversation");


 const createChat = async (req, res) => {
  try {
    const userId = req.user.id

    const newChat = await Chat.create({
      userId,
    });

    res.status(201).json({
      success: true,
      chat: newChat,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

 const getChats = async (req, res) => {
  try {
    const chats = await Chat.find({ userId: req.user.id }).sort({ createdAt: -1 });

    res.json({
      success: true,
      chats,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};


const addConversation = async (req, res) => {
  try {

    
    const chat = await Chat.findById(req.params.id);
    
    if (!chat) {
   
      return res.status(404).json({ success: false, message: "Chat not found" });
    }
    
    if (chat.userId.toString() !== req.user.id) {
    
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }
    
    const userQuestion = req.body.question;
    
    const geminiAnswer = await callGeminiAPI(userQuestion);

    
    const newConversation = await Conversation.create({
      chatId: chat._id,
      question: userQuestion,
      answer: geminiAnswer,
    });


    const updatedChat = await Chat.findByIdAndUpdate(
      chat._id,
      { latestMessage: userQuestion },
      { new: true }
    );

    return res.status(201).json({
      success: true,
      conversation: newConversation,
      chat: updatedChat,
    });

  } catch (error) {
    console.error("Gemini conversation error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to get response from Gemini or save conversation",
      error: error.message,
    });
  }
};


 const getConversations = async (req, res) => {
  try {
    const conversations = await Conversation.find({ chatId: req.params.id }).sort({ createdAt: 1 });

    res.json({
      success: true,
      conversations,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};


const deleteChat = async (req, res) => {
  try {
    const chat = await Chat.findById(req.params.id);

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: "Chat not found",
      });
    }

    if (chat.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this chat",
      });
    }

    await Conversation.deleteMany({ chatId: chat._id }); 
    await chat.deleteOne();

    res.json({
      success: true,
      message: "Chat and related conversations deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};


module.exports = {
 createChat,
  getChats,
  addConversation,
  getConversations,
  deleteChat,
}