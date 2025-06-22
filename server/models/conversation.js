const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema({
  chatId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Chat',
    required: true,
  },
question:{
    type: String,
    required: true,
},
answer:{
    type: String,
    required: true,
}

}, { timestamps: true });

module.exports = mongoose.model('Conversation', conversationSchema);