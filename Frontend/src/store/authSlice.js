import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import authService from '../services/authService';

// Async Thunks
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const data = await authService.login(email, password);
      return data;
    } catch (err) {
      return rejectWithValue(err.message || 'Login failed');
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async ({ username, email, password }, { rejectWithValue }) => {
    try {
      const data = await authService.register(username, email, password);
      return data;
    } catch (err) {
      return rejectWithValue(err.message || 'Registration failed');
    }
  }
);

export const fetchCurrentUser = createAsyncThunk(
  'auth/fetchCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      const user = await authService.getMe();
      return user;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to fetch user');
    }
  }
);

export const updateUserBudget = createAsyncThunk(
  'auth/updateUserBudget',
  async (budget, { rejectWithValue }) => {
    try {
      const newBudget = await authService.updateBudget(budget);
      return newBudget;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to update budget');
    }
  }
);

const initialUser = authService.getCurrentUser();

const initialState = {
  user: initialUser,
  token: authService.getToken(),
  budget: initialUser?.budget || 2000,
  loading: false,
  error: null
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      authService.logout();
      state.user = null;
      state.token = null;
      state.budget = 2000;
      state.error = null;
      state.loading = false;
    },
    clearAuthError(state) {
      state.error = null;
    },
    setBudget(state, action) {
      state.budget = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.budget = action.payload.user?.budget || 2000;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Login failed';
      })

      // Register
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.budget = action.payload.user?.budget || 2000;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Registration failed';
      })

      // Fetch Profile
      .addCase(fetchCurrentUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        if (action.payload.budget !== undefined) {
          state.budget = action.payload.budget;
        }
      })
      .addCase(fetchCurrentUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update Budget
      .addCase(updateUserBudget.fulfilled, (state, action) => {
        state.budget = action.payload;
        if (state.user) {
          state.user.budget = action.payload;
        }
      });
  }
});

export const { logout, clearAuthError, setBudget } = authSlice.actions;
export default authSlice.reducer;
