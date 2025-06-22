import { configureStore } from '@reduxjs/toolkit';
import authReducer from './auth-slice/index';
import subjectReducer from './subject-slice/index'; 
import chapterReducer from './chapter-slice/index';
import notesReducer from './note-slice/index'; 
import chatsReducer from './chat-slice/index'; 

const store = configureStore({
  reducer: {
    auth: authReducer,
    subjects: subjectReducer, 
    chapters: chapterReducer,
    notes: notesReducer, 
    notes: notesReducer, 
    chatbot: chatsReducer, 

  },
});

export default store;
