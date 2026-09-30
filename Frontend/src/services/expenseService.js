import authService from './authService';

const API_URL = '/api/expenses';

const handleResponse = async (response) => {
  let data;
  try {
    data = await response.json();
  } catch {
    data = { message: response.statusText || `Server returned error (${response.status})` };
  }

  if (!response.ok) {
    if (response.status === 401) {
      authService.logout();
      window.location.href = '/login';
    }
    throw new Error(data.message || `API request failed with status ${response.status}`);
  }
  return data;
};

const expenseService = {
  async getExpenses() {
    const response = await fetch(API_URL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...authService.getAuthHeader()
      }
    });
    const data = await handleResponse(response);
    // Map _id to id so frontend doesn't need to change its object property checks
    return (data.expenses || []).map(exp => ({
      ...exp,
      id: exp._id
    }));
  },

  async createExpense(expenseData) {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...authService.getAuthHeader()
      },
      body: JSON.stringify(expenseData)
    });
    const data = await handleResponse(response);
    return {
      ...data.expense,
      id: data.expense._id
    };
  },

  async updateExpense(id, expenseData) {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...authService.getAuthHeader()
      },
      body: JSON.stringify(expenseData)
    });
    const data = await handleResponse(response);
    return {
      ...data.expense,
      id: data.expense._id
    };
  },

  async deleteExpense(id) {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...authService.getAuthHeader()
      }
    });
    return await handleResponse(response);
  }
};

export default expenseService;
