import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isLoading: false,
  noteList: [],
  note: null,
};

// Fetch notes for a specific chapter
export const fetchNotesByChapter = createAsyncThunk(
  "notes/fetchNotesByChapter",
  async (chapterId, { rejectWithValue }) => {
    try {
const token = JSON.parse(sessionStorage.getItem("token"));
const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/notes/get/${chapterId}`, {
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

      return response?.data || { success: false, message: "No data found" };
    } catch (err) {
      const errorMessage = err?.response?.data?.message || err.message || "Failed to fetch notes";
      return rejectWithValue(errorMessage);
    }
  }
);

// Create a new note (PDF or typed)
export const createNote = createAsyncThunk(
  "notes/createNote",
  async (formData, { rejectWithValue }) => {
    try {
const token = JSON.parse(sessionStorage.getItem("token"));
const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/notes/create`, formData, {
  headers: {
    Authorization: `Bearer ${token}`,
    "Content-Type": "multipart/form-data",
  },
});

      return response?.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to create note");
    }
  }
);

// Update a note (title/content/favorite)
export const updateNote = createAsyncThunk(
  "notes/updateNote",
  async ({ id, title,content }, { rejectWithValue }) => {
    try {
      
const token = JSON.parse(sessionStorage.getItem("token"));
const response = await axios.put(`${import.meta.env.VITE_API_URL}/api/notes/edit/${id}`, { title, content }, {
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

      return response?.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to update note");
    }
  }
);

export const getNoteById = createAsyncThunk(
  "notes/getNoteById",
  async (noteId, { rejectWithValue }) => {
    try {
const token = JSON.parse(sessionStorage.getItem("token"));
const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/notes/getNote/${noteId}`, {
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

      return response?.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch note");
    }
  }

)


// Toggle favorite status of a note
export const toggleFavorite = createAsyncThunk(
  "notes/toggleFavorite",
  async (noteId, { rejectWithValue }) => {
    try {
const token = JSON.parse(sessionStorage.getItem("token"));
const response = await axios.put(`${import.meta.env.VITE_API_URL}/api/notes/favorite/${noteId}`, {}, {
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

      return response?.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to toggle favorite");
    }
  }
);

// Delete a note
export const deleteNote = createAsyncThunk(
  "notes/deleteNote",
  async (noteId, { rejectWithValue }) => {
    try {
const token = JSON.parse(sessionStorage.getItem("token"));
const response = await axios.delete(`${import.meta.env.VITE_API_URL}/api/notes/delete/${noteId}`, {
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

      return response?.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to delete note");
    }
  }
);


  

const noteSlice = createSlice({
  name: "notes",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Notes
      .addCase(fetchNotesByChapter.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchNotesByChapter.fulfilled, (state, action) => {
        state.isLoading = false;
        state.noteList = action.payload.data;
      })
      .addCase(fetchNotesByChapter.rejected, (state) => {
        state.isLoading = false;
        state.noteList = [];
      }).addCase(getNoteById.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getNoteById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.note = action.payload.data;
      }
      ).addCase(getNoteById.rejected, (state) => {
        state.isLoading = false;
        state.note = null;
      }
      )


      // Create Note
      .addCase(createNote.fulfilled, (state, action) => {
        state.noteList.unshift(action.payload.data);
      })

     

      // Toggle Favorite
      .addCase(toggleFavorite.fulfilled, (state, action) => {
        const updated = action.payload.data;
        const index = state.noteList.findIndex(note => note._id === updated._id);
        if (index !== -1) {
          state.noteList[index] = updated;
        }
      })

  },
});

export default noteSlice.reducer;
