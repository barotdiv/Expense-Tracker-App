const API_URL = '/api/auth';

const authService = {
  async login(email, password) {
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      if (data.token) {
        localStorage.setItem('spendwise_token', data.token);
        localStorage.setItem('spendwise_user', JSON.stringify(data.user));
      }
      return data;
    } catch (err) {
      throw new Error(err.message || 'Unable to reach authentication server');
    }
  },

  async register(name, email, password) {
    try {
      const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      if (data.token) {
        localStorage.setItem('spendwise_token', data.token);
        localStorage.setItem('spendwise_user', JSON.stringify(data.user));
      }
      return data;
    } catch (err) {
      throw new Error(err.message || 'Unable to reach authentication server');
    }
  },

  logout() {
    localStorage.removeItem('spendwise_token');
    localStorage.removeItem('spendwise_user');
  },

  getCurrentUser() {
    const userStr = localStorage.getItem('spendwise_user');
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  },

  getToken() {
    return localStorage.getItem('spendwise_token');
  },

  getAuthHeader() {
    const token = this.getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  },

  async getMe() {
    try {
      const response = await fetch(`${API_URL}/me`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...this.getAuthHeader(),
        },
      });

      const data = await response.json();
      if (!response.ok) {
        if (response.status === 401) {
          this.logout();
        }
        throw new Error(data.message || 'Failed to fetch user profile');
      }

      localStorage.setItem('spendwise_user', JSON.stringify(data.user));
      return data.user;
    } catch (err) {
      throw new Error(err.message || 'Unable to reach authentication server');
    }
  },

  async updateBudget(budget) {
    try {
      const response = await fetch(`${API_URL}/budget`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...this.getAuthHeader(),
        },
        body: JSON.stringify({ budget }),
      });

      const data = await response.json();
      if (!response.ok) {
        if (response.status === 401) {
          this.logout();
        }
        throw new Error(data.message || 'Failed to update budget');
      }

      const user = this.getCurrentUser();
      if (user) {
        user.budget = data.budget;
        localStorage.setItem('spendwise_user', JSON.stringify(user));
      }
      return data.budget;
    } catch (err) {
      throw new Error(err.message || 'Unable to reach authentication server');
    }
  }
};

export default authService;
