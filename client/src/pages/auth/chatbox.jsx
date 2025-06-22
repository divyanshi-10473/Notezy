import React, { useEffect, useState } from 'react';
import Sidebar from '@/components/common/sidebar';
import { useDispatch, useSelector } from 'react-redux';
import {
  createChat,
  getChats,
  deleteChat,
  addConversation,
  getConversations,
  setCurrentChatId,
} from '../../../store/chat-slice/index';

const Chatbot = () => {
  const dispatch = useDispatch();
  const { chats, currentChatId, conversations, isLoading } = useSelector((state) => state.chatbot);

  const [question, setQuestion] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    dispatch(getChats());
  }, [dispatch]);

  const handleNewChat = async () => {
    const result = await dispatch(createChat());
    if (createChat.fulfilled.match(result)) {
      const newId = result.payload._id;
      dispatch(setCurrentChatId(newId));
      dispatch(getConversations(newId));
    }
  };

  const handleDeleteChat = async (chatId) => {
    await dispatch(deleteChat(chatId));
  };

  const handleSelectChat = async (chatId) => {
    dispatch(setCurrentChatId(chatId));
    dispatch(getConversations(chatId));
  };

  const handleSendQuestion = async () => {
    if (!question.trim() || !currentChatId) return;
    setSending(true);
    const result = await dispatch(addConversation({ chatId: currentChatId, question }));
    if (addConversation.fulfilled.match(result)) {
      setQuestion('');
    }
    setSending(false);
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-orange-200 to-orange-50">
  
      <Sidebar
        chats={chats}
        onNewChat={handleNewChat}
        onDeleteChat={handleDeleteChat}
        onSelectChat={handleSelectChat}
      />

      <div className="flex-1 flex flex-col justify-between px-6 py-4 overflow-hidden">
       <div className="text-2xl font-semibold mb-4 ml-9 md:ml-0 ">Your Study Assistant</div>


        <div className="flex-1 overflow-y-auto space-y-4 pr-2">
          {isLoading && <div className="text-sm text-black">Loading conversations...</div>}

          {conversations.length === 0 && (
            <div className="text-gray-400">No messages yet. Start a conversation!</div>
          )}

          {conversations.map((conv, idx) => (
            <div key={idx} className="space-y-2">
              <div className="bg-white rounded-lg p-3 shadow-sm">
                <span className="font-semibold text-amber-900">You:</span> {conv.question}
              </div>
              <div className="bg-orange-50 rounded-lg p-3 shadow-inner">
                <span className="font-semibold text-green-800">AI:</span> {conv.answer}
              </div>
            </div>
          ))}
        </div>

       
        {currentChatId ? (
          <div className="mt-4 flex items-center gap-2">
            <input
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              type="text"
              placeholder="Ask something..."
              className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:border-b-rose-950"
              onKeyDown={(e) => e.key === 'Enter' && handleSendQuestion()}
            />
            <button
              onClick={handleSendQuestion}
              disabled={sending}
              className="bg-amber-950 text-white px-4 py-2 rounded-lg hover:bg-amber-800 disabled:opacity-50"
            >
              {sending ? 'Sending...' : 'Send'}
            </button>
          </div>
        ) : (
          <div className="text-gray-400 mt-4">Select a chat to start messaging.</div>
        )}
      </div>
    </div>
  );
};

export default Chatbot;
