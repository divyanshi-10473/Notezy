import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isLoading: false,
  chapterList: [],
};

const getAuthHeader = () => {
  const token = JSON.parse(sessionStorage.getItem("token"));
  if (!token) return {};
  return {
    Authorization: `Bearer ${token}`,
  };
};

export const fetchChaptersBySubject = createAsyncThunk(
  "chapters/fetchChaptersBySubject",
  async (subjectId, { rejectWithValue }) => {
    try {
    
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/chapters/get/${subjectId}`, {
        headers: getAuthHeader(),
      });
      return response?.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch chapters");
    }
  }
);

// Create a new chapter
export const createChapter = createAsyncThunk(
  "chapters/createChapter",
  async ({ chapter_name, subjectId }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/chapters/create`,
        { chapter_name, subjectId },
        {  headers: getAuthHeader() }
      );
      return response?.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Something went wrong");
    }
  }
);


export const editChapter = createAsyncThunk(
  "chapters/editChapter",
  async ({ id, chapter_name, isCompleted }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/chapters/edit/${id}`,
        { chapter_name, isCompleted },
        {  headers: getAuthHeader()}
      );
      return response?.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Update failed");
    }
  }
);


export const deleteChapter = createAsyncThunk(
  "chapters/deleteChapter",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/chapters/delete/${id}`,
        {  headers: getAuthHeader()}
      );
      return response?.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Delete failed");
    }
  }
);

const chapterSlice = createSlice({
  name: "chapters",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
     
      .addCase(fetchChaptersBySubject.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchChaptersBySubject.fulfilled, (state, action) => {
        state.isLoading = false;
        state.chapterList = action.payload.data;
      })
      .addCase(fetchChaptersBySubject.rejected, (state) => {
        state.isLoading = false;
        state.chapterList = [];
      })




  },
});

export default chapterSlice.reducer;
