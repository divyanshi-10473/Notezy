import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API = `${import.meta.env.VITE_API_URL}/api/chats`;

export const createChat = createAsyncThunk(
  'chat/createChat',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${API}/new`, {}, { withCredentials: true });
      return res.data.chat;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to create chat');
    }
  }
);

export const getChats = createAsyncThunk(
  'chat/getChats',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${API}/all`, { withCredentials: true });
      return res.data.chats;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch chats');
    }
  }
);

export const addConversation = createAsyncThunk(
  'chat/addConversation',
  async ({ chatId, question }, { rejectWithValue }) => {
   
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/chats/add/${chatId}`,
        { question },
        { withCredentials: true }
      );
      return res.data;
    } catch (err) {
      console.error("❌ Add conversation failed:", err.response?.data || err.message);
      return rejectWithValue(err.response?.data?.message || 'Failed to send message');
    }
  }
);


export const getConversations = createAsyncThunk(
  'chat/getConversations',
  async (chatId, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${API}/get/${chatId}`, { withCredentials: true });
      return res.data.conversations;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch conversation');
    }
  }
);

export const deleteChat = createAsyncThunk(
  'chat/deleteChat',
  async (chatId, { rejectWithValue }) => {
    try {
      await axios.delete(`${API}/delete/${chatId}`, { withCredentials: true });
      return chatId;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to delete chat');
    }
  }
);

const chatSlice = createSlice({
  name: 'chat',
  initialState: {
    chats: [],
    currentChatId: null,
    conversations: [],
    isLoading: false,
    error: null,
  },
  reducers: {
    setCurrentChatId: (state, action) => {
      state.currentChatId = action.payload;
    },
    resetChatState: (state) => {
      state.chats = [];
      state.conversations = [];
      state.currentChatId = null;
      state.isLoading = false;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createChat.fulfilled, (state, action) => {
        state.chats.unshift(action.payload);
        state.currentChatId = action.payload._id;
        state.error = null;
      })
      .addCase(getChats.fulfilled, (state, action) => {
        state.chats = action.payload;
        state.error = null;
      })
      .addCase(addConversation.fulfilled, (state, action) => {
        state.conversations.push(action.payload.conversation);
        const index = state.chats.findIndex(chat => chat._id === action.payload.chat._id);
        if (index !== -1) {
          state.chats[index] = action.payload.chat;
        }
        state.error = null;
      })
      .addCase(getConversations.fulfilled, (state, action) => {
        state.conversations = action.payload;
        state.error = null;
      })
      .addCase(deleteChat.fulfilled, (state, action) => {
        state.chats = state.chats.filter(chat => chat._id !== action.payload);
        if (state.currentChatId === action.payload) {
          state.currentChatId = null;
          state.conversations = [];
        }
        state.error = null;
      })

    
      .addMatcher(
        (action) => action.type.startsWith('chat/') && action.type.endsWith('/pending'),
        (state) => {
          state.isLoading = true;
          state.error = null;
        }
      )

      
      .addMatcher(
        (action) => action.type.startsWith('chat/') && action.type.endsWith('/rejected'),
        (state, action) => {
          state.isLoading = false;
          state.error = action.payload;
        }
      )

    
      .addMatcher(
        (action) => action.type.startsWith('chat/') && action.type.endsWith('/fulfilled'),
        (state) => {
          state.isLoading = false;
        }
      );
  },
});

export const { setCurrentChatId, resetChatState } = chatSlice.actions;
export default chatSlice.reducer;
