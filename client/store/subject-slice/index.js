import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isLoading: false,
  subjectsList: [],
};


export const fetchSubjects = createAsyncThunk(
  "subjects/fetchSubjects",
  async (_, { rejectWithValue }) => {
    try {
      const token = JSON.parse(sessionStorage.getItem('token')); // Get token from storage

      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/subjects/get`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response?.data; 
    } catch (err) {
      if (err.response && err.response.data) {
        return rejectWithValue(err.response.data.message);
      } else {
        return rejectWithValue("Failed to fetch subjects");
      }
    }
  }
)
  


  export const createSubject = createAsyncThunk(
    "subjects/createSubject",
    async (subject_name, { rejectWithValue }) => {
      try {
         const token = JSON.parse(sessionStorage.getItem("token"));
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/subjects/create`, subject_name, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        return response?.data;
      } catch (err) {
        if (err.response && err.response.data) {
          return rejectWithValue(err.response.data.message);
        } else {
          return rejectWithValue("Something went wrong");
        }
      }
    }
  );

  
 
export const editSubject = createAsyncThunk(
  "subjects/editSubject",
  async ({ id, subject_name }, { rejectWithValue }) => {
    try {
      const token = JSON.parse(sessionStorage.getItem("token"));

      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/subjects/edit/${id}`,
        { subject_name },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response?.data;
    } catch (err) {
      if (err.response && err.response.data) {
        return rejectWithValue(err.response.data.message);
      } else {
        return rejectWithValue("Something went wrong");
      }
    }
  }
);


export const deleteSubject = createAsyncThunk(
  "subjects/deleteSubject",
  async (id, { rejectWithValue }) => {
    try {
      const token = JSON.parse(sessionStorage.getItem("token"));

      const response = await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/subjects/delete/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response?.data;
    } catch (err) {
      if (err.response && err.response.data) {
        return rejectWithValue(err.response.data.message);
      } else {
        return rejectWithValue("Something went wrong");
      }
    }
  }
);

  



const subjectSlice = createSlice({
  name: "subjects",
  initialState,
  reducers: {},
  extraReducers: (builder)=>{
    builder.addCase(fetchSubjects.pending,(state)=>{
        state.isLoading = true;

    }).addCase(fetchSubjects.fulfilled,(state,action)=>{
   
        state.isLoading = false;
        state.subjectsList = action?.payload?.data;
    }).addCase(fetchSubjects.rejected,(state,action)=>{
        
        state.isLoading = false;
        state.subjectsList = [];
    })
}
  
});

export default subjectSlice.reducer;
