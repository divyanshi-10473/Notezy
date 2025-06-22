import React, { useEffect, useRef, useState } from 'react';
import { Trash2, Plus, Menu } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import clsx from 'clsx';

import {
  createChat,
  getChats,
  deleteChat,
  setCurrentChatId,
  getConversations,
} from '../../../store/chat-slice/index';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();
  const sidebarRef = useRef();
  const { chats, currentChatId } = useSelector((state) => state.chatbot);

  useEffect(() => {
    dispatch(getChats());
  }, [dispatch]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isOpen &&
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleNewChat = async () => {
    const result = await dispatch(createChat());
    if (createChat.fulfilled.match(result)) {
      dispatch(setCurrentChatId(result.payload._id));
      dispatch(getConversations(result.payload._id));
    }
  };

  const handleSelectChat = (chatId) => {
    dispatch(setCurrentChatId(chatId));
    dispatch(getConversations(chatId));
    setIsOpen(false);
  };

  const handleDeleteChat = async (chatId) => {
    await dispatch(deleteChat(chatId));
  };

  const toggleSidebar = () => setIsOpen((prev) => !prev);

  return (
    <>
      {/* Toggle Button (visible only on small screens) */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-orange-100 to-orange-800 text-black rounded shadow-lg"
        onClick={toggleSidebar}
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Sidebar */}
      <div
        ref={sidebarRef}
        className={clsx(
          'fixed md:relative top-0 left-0 h-screen w-64 bg-amber-950 text-white border-r border-gray-800 flex flex-col z-40 transform transition-transform duration-300',
          {
            '-translate-x-full': !isOpen,
            'translate-x-0': isOpen,
            'md:translate-x-0': true,
          }
        )}
      >
        <div className="p-4 border-b border-white flex justify-between items-center">
          <button
            onClick={handleNewChat}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-orange-100 hover:bg-orange-200 rounded-lg transition text-black mt-10"
          >
            <Plus className="w-4 h-4" />
            New Chat
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {chats.length === 0 ? (
            <div className="text-sm text-gray-400">No recent chats</div>
          ) : (
            chats.map((chat) => (
              <div
                key={chat._id}
                className={clsx(
                  'flex items-center justify-between bg-white text-black hover:bg-orange-50 rounded-lg px-3 py-2 cursor-pointer group',
                  currentChatId === chat._id && 'bg-gray-700 '
                )}
                onClick={() => handleSelectChat(chat._id)}
              >
                <span className="truncate max-w-[180px]">
                  {chat.latestMessage || 'New Chat'}
                </span>
                <Trash2
                  className="w-4 h-4 text-gray-400 hover:text-red-500"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteChat(chat._id);
                  }}
                />
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default Sidebar;
