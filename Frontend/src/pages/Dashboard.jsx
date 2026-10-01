import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import CategoryPieChart from "../components/CategoryPieChart";
import MonthlyBarChart from "../components/MonthlyBarChart";
import Header from '../components/Header';
import BudgetManager from '../components/BudgetManager';
import ExpenseForm from '../components/ExpenseForm';
import ExpenseList from '../components/ExpenseList';
import CategoryBreakdown from '../components/CategoryBreakdown';
import AiExpenseSuggestion from '../components/AiExpenseSuggestion';
import { fetchCurrentUser, logout, updateUserBudget, setBudget } from '../store/authSlice';
import { fetchExpenses, addExpense, deleteExpense, editExpense } from '../store/expenseSlice';

function Dashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, budget, loading: authLoading, error: authError } = useSelector((state) => state.auth);
  const { items: expenses, loading: expensesLoading, error: expensesError } = useSelector((state) => state.expenses);

  const loading = (authLoading || expensesLoading) && expenses.length === 0;
  const error = authError || expensesError;

  useEffect(() => {
    dispatch(fetchCurrentUser());
    dispatch(fetchExpenses());
  }, [dispatch]);

  const handleAddExpense = async (newExpenseData) => {
    try {
      await dispatch(addExpense({
        title: newExpenseData.title,
        amount: newExpenseData.amount,
        category: newExpenseData.category,
        date: newExpenseData.date
      })).unwrap();
    } catch (err) {
      console.error('Failed to add expense:', err);
      alert('Failed to add expense. Please try again.');
    }
  };

  const handleDeleteExpense = async (id) => {
    try {
      await dispatch(deleteExpense(id)).unwrap();
    } catch (err) {
      console.error('Failed to delete expense:', err);
      alert('Failed to delete expense. Please try again.');
    }
  };

  const handleEditExpense = async (id, updatedAmount) => {
    try {
      const expenseToUpdate = expenses.find((exp) => exp.id === id);
      if (!expenseToUpdate) return;
      const updatedData = { ...expenseToUpdate, amount: parseFloat(updatedAmount) };
      await dispatch(editExpense({ id, updatedData })).unwrap();
    } catch (err) {
      console.error('Failed to update expense:', err);
      alert('Failed to update expense. Please try again.');
    }
  };

  const handleBudgetChange = (newBudget) => {
    dispatch(setBudget(newBudget));
    dispatch(updateUserBudget(newBudget));
  };

  const handleLogout = () => {
    dispatch(logout());
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
        <BudgetManager
          expenses={expenses}
          onBudgetChange={handleBudgetChange}
        />

        {/* Core Workspace */}
        <main className="dashboard-grid">
          {/* Left column: Add Expense form & Category Breakdown stats */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <ExpenseForm onAddExpense={handleAddExpense} />
            <CategoryBreakdown expenses={expenses} />
            <AiExpenseSuggestion expenses={expenses} budget={budget} />
          </div>

          {/* Right column: Search, Filter, Sort, and Expense List */}
          <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100%' }}>
            <ExpenseList
              expenses={expenses}
              onDeleteExpense={handleDeleteExpense}
              onEditExpense={handleEditExpense}
            />
          </div>
        </main>

        {/* Analytics Section */}
        <section className="analytics-section" style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <h2 className="card-title" style={{ borderBottom: '1px solid var(--border-card)', paddingBottom: '0.75rem' }}>
            <span>📈</span> Analytics & Insights
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            <CategoryPieChart expenses={expenses} />
            <MonthlyBarChart expenses={expenses} />
          </div>
        </section>


        {/* Footer */}
        <footer className="app-footer">
          <p>© {new Date().getFullYear()} SpendWise. Created using React & Vanilla CSS.</p>
        </footer>
      </div>
    </>
  );
}

export default Dashboard;

