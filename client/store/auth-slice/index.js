import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState={
    isAuthenticated: false,
    isLoading: true,
    user: null
}

export const registerUser = createAsyncThunk(
  'auth/register',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/register`, formData, {
        withCredentials: true,
      });
      return response.data;
    } catch (err) {
      if (err.response && err.response.data) {
        return rejectWithValue(err.response.data.message);
      }
      return rejectWithValue("Something went wrong");
    }
  }
);

export const loginUser = createAsyncThunk(
  'auth/login',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/login`, formData, {
        withCredentials: true,
      });
      return response.data;
    } catch (err) {
      if (err.response && err.response.data) {
        return rejectWithValue(err.response.data.message);
      } else {
        return rejectWithValue("Something went wrong");
      }
    }
  }
);


export const loginWithGoogle = createAsyncThunk(
  'auth/loginWithGoogle',
  async (googleData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/google-login`, {
        code: googleData.code,
      }, { withCredentials: true }); 

      return response.data; 
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Google login failed');
    }
  }
);


export const logoutUser = createAsyncThunk(
  "/auth/logout",

  async () => {
    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/api/auth/logout`,
      {},
      {
        withCredentials: true,
      }
    );

    return response.data;
  }
);
export const checkAuth = createAsyncThunk(
  'auth/checkauth',
  async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/auth/check-auth`,  {
        withCredentials: true,
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          
        }

      });
      return response.data;
    } catch (err) {
      if (err.response && err.response.data) {
        return rejectWithValue(err.response.data.message);
      } else {
        return rejectWithValue("Something went wrong");
      }
    }
  }
);



const authSlice = createSlice({
      name: "auth",
      initialState,
      reducers: {
        setUser: (state,action)=>{
              
        }
      },
      extraReducers: (builder) => {
        builder
          .addCase(registerUser.pending, (state) => {
            state.isLoading = true;
          })
          .addCase(registerUser.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isAuthenticated = false;
            state.user = null;
          })
          .addCase(registerUser.rejected, (state) => {
            state.isLoading = false;
            state.isAuthenticated = false;
          })
          .addCase(loginUser.pending, (state) => {
            state.isLoading = true;
          })
          .addCase(loginUser.fulfilled, (state, action) => {
            state.isLoading = false;
            state.user =action.payload.success ?   action.payload.user : null ;
            state.isAuthenticated =action.payload.success ? true : false;
          })
          .addCase(loginUser.rejected, (state) => {
            state.isLoading = false;
            state.user = null;
            state.isAuthenticated = false;
          })

          .addCase(loginWithGoogle.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginWithGoogle.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        localStorage.setItem('token', action.payload.token); // optional
      })
      .addCase(loginWithGoogle.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
          .addCase(checkAuth.pending, (state) => {
            state.isLoading = true;
          })
          .addCase(checkAuth.fulfilled, (state, action) => {
            state.isLoading = false;
            state.user =action.payload.success ?   action.payload.user : null ;
            state.isAuthenticated =action.payload.success ? true : false;
          })
          .addCase(checkAuth.rejected, (state) => {
            state.isLoading = false;
            state.user = null;
            state.isAuthenticated = false;
          }).addCase(logoutUser.fulfilled, (state, action) => {
            state.isLoading = false;
            state.user = null;
            state.isAuthenticated = false;
          });

        }


})



export const {setUser} = authSlice.actions;
export default authSlice.reducer;