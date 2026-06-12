import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import StatsGrid from '../components/StatsGrid';
import ExpenseForm from '../components/ExpenseForm';
import ExpenseList from '../components/ExpenseList';
import CategoryBreakdown from '../components/CategoryBreakdown';
import authService from '../services/authService';
import expenseService from '../services/expenseService';

function Dashboard() {
  const [expenses, setExpenses] = useState([]);
  const [budget, setBudget] = useState(2000);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        // Load profile first to get budget info
        const profile = await authService.getMe();
        setUser(profile);
        setBudget(profile.budget || 2000);

        // Load expenses
        const expenseList = await expenseService.getExpenses();
        setExpenses(expenseList);
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
        setError('Failed to fetch data from the server.');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleAddExpense = async (newExpenseData) => {
    try {
      const created = await expenseService.createExpense({
        title: newExpenseData.title,
        amount: newExpenseData.amount,
        category: newExpenseData.category,
        date: newExpenseData.date
      });
      setExpenses((prevExpenses) => [created, ...prevExpenses]);
    } catch (err) {
      console.error('Failed to add expense:', err);
      alert('Failed to add expense. Please try again.');
    }
  };

  const handleDeleteExpense = async (id) => {
    try {
      await expenseService.deleteExpense(id);
      setExpenses((prevExpenses) => prevExpenses.filter((item) => item.id !== id));
    } catch (err) {
      console.error('Failed to delete expense:', err);
      alert('Failed to delete expense. Please try again.');
    }
  };

  const handleSetBudget = async (newBudget) => {
    try {
      const updatedBudget = await authService.updateBudget(newBudget);
      setBudget(updatedBudget);
    } catch (err) {
      console.error('Failed to update budget:', err);
      alert('Failed to update budget. Please try again.');
    }
  };

  const handleLogout = () => {
    authService.logout();
    navigate('/login', { replace: true });
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        gap: '1rem',
        color: 'var(--text-muted)'
      }}>
        <div className="spinner" style={{ fontSize: '2.5rem', animation: 'spin 2s linear infinite' }}>⏳</div>
        <p style={{ fontWeight: 600 }}>Loading SpendWise Dashboard...</p>
      </div>
    );
  }

  return (
    <>
      {/* Decorative moving blur backgrounds */}
      <div className="gradient-bg" aria-hidden="true">
        <div className="gradient-blob-1"></div>
        <div className="gradient-blob-2"></div>
      </div>

      <div className="app-container animate-fadein">
        {/* Header section */}
        <Header 
          expenseCount={expenses.length} 
          username={user?.username} 
          onLogout={handleLogout} 
        />

        {error && (
          <div className="error-message" style={{ margin: '1rem 0' }}>
            <span>⚠️</span> {error}
          </div>
        )}

        {/* Dashboard overview stats: Budget, Spent, Remaining */}
        <StatsGrid 
          expenses={expenses} 
          budget={budget} 
          onSetBudget={handleSetBudget} 
        />

        {/* Core Workspace */}
        <main className="dashboard-grid">
          {/* Left column: Add Expense form & Category Breakdown stats */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <ExpenseForm onAddExpense={handleAddExpense} />
            <CategoryBreakdown expenses={expenses} />
          </div>

          {/* Right column: Search, Filter, Sort, and Expense List */}
          <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100%' }}>
            <ExpenseList 
              expenses={expenses} 
              onDeleteExpense={handleDeleteExpense} 
            />
          </div>
        </main>

        {/* Footer */}
        <footer className="app-footer">
          <p>© {new Date().getFullYear()} SpendWise. Created using React & Vanilla CSS.</p>
        </footer>
      </div>
    </>
  );
}

export default Dashboard;
