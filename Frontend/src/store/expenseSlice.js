import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import expenseService from '../services/expenseService';

// Async Thunks
export const fetchExpenses = createAsyncThunk(
  'expenses/fetchExpenses',
  async (_, { rejectWithValue }) => {
    try {
      const expenses = await expenseService.getExpenses();
      return expenses;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to fetch expenses');
    }
  }
);

export const addExpense = createAsyncThunk(
  'expenses/addExpense',
  async (expenseData, { rejectWithValue }) => {
    try {
      const created = await expenseService.createExpense(expenseData);
      return created;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to add expense');
    }
  }
);

export const editExpense = createAsyncThunk(
  'expenses/editExpense',
  async ({ id, updatedData }, { rejectWithValue }) => {
    try {
      const updated = await expenseService.updateExpense(id, updatedData);
      return updated;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to update expense');
    }
  }
);

export const deleteExpense = createAsyncThunk(
  'expenses/deleteExpense',
  async (id, { rejectWithValue }) => {
    try {
      await expenseService.deleteExpense(id);
      return id;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to delete expense');
    }
  }
);

const initialState = {
  items: [],
  loading: false,
  error: null
};

const expenseSlice = createSlice({
  name: 'expenses',
  initialState,
  reducers: {
    clearExpenseError(state) {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Expenses
      .addCase(fetchExpenses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchExpenses.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchExpenses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Add Expense
      .addCase(addExpense.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      })
      .addCase(addExpense.rejected, (state, action) => {
        state.error = action.payload;
      })

      // Edit Expense
      .addCase(editExpense.fulfilled, (state, action) => {
        const index = state.items.findIndex(item => item.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(editExpense.rejected, (state, action) => {
        state.error = action.payload;
      })

      // Delete Expense
      .addCase(deleteExpense.fulfilled, (state, action) => {
        state.items = state.items.filter(item => item.id !== action.payload);
      })
      .addCase(deleteExpense.rejected, (state, action) => {
        state.error = action.payload;
      });
  }
});

export const { clearExpenseError } = expenseSlice.actions;
export default expenseSlice.reducer;
