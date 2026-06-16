import React, { useState, useEffect } from 'react';
import BudgetSummary from './BudgetSummary';
import BudgetProgressBar from './BudgetProgressBar';

function BudgetManager({ expenses, onBudgetChange }) {
  // Initialize budget from localStorage or default to 2000
  const [budget, setBudget] = useState(() => {
    const savedBudget = localStorage.getItem('monthly_budget');
    return savedBudget !== null ? parseFloat(savedBudget) : 2000;
  });
  
  const [isEditing, setIsEditing] = useState(false);
  const [tempBudget, setTempBudget] = useState(budget.toString());

  // Save to localStorage whenever budget changes
  useEffect(() => {
    localStorage.setItem('monthly_budget', budget);
    if (onBudgetChange) {
      onBudgetChange(budget);
    }
  }, [budget, onBudgetChange]);

  // Calculate current month's expenses
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  const currentMonthExpenses = expenses.filter(expense => {
    const expenseDate = new Date(expense.date);
    return expenseDate.getMonth() === currentMonth && expenseDate.getFullYear() === currentYear;
  });

  const totalSpent = currentMonthExpenses.reduce((sum, item) => sum + item.amount, 0);
  const remainingBudget = budget - totalSpent;
  const usagePercentage = budget > 0 ? (totalSpent / budget) * 100 : 0;

  const handleBudgetSubmit = (e) => {
    e.preventDefault();
    const newBudget = parseFloat(tempBudget);
    if (!isNaN(newBudget) && newBudget >= 0) {
      setBudget(newBudget);
      setIsEditing(false);
    }
  };

  // Format currency for alerts
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2
    }).format(value);
  };

  return (
    <div className="budget-manager" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      
      {/* Budget Setup Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-main)' }}>Monthly Budget Tracker</h2>
        
        {!isEditing ? (
          <button 
            className="btn-primary" 
            onClick={() => {
              setTempBudget(budget.toString());
              setIsEditing(true);
            }}
            style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
          >
            ✏️ Edit Budget
          </button>
        ) : (
          <form onSubmit={handleBudgetSubmit} style={{ display: 'flex', gap: '0.5rem' }}>
            <input
              type="number"
              step="any"
              min="0"
              value={tempBudget}
              onChange={(e) => setTempBudget(e.target.value)}
              autoFocus
              required
              style={{
                padding: '0.5rem',
                borderRadius: '8px',
                border: '1px solid var(--border-card)',
                backgroundColor: 'var(--bg-card)',
                color: 'var(--text-main)',
                width: '120px'
              }}
            />
            <button type="submit" className="btn-primary" style={{ padding: '0.5rem 1rem' }}>Save</button>
            <button type="button" onClick={() => setIsEditing(false)} style={{ padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid var(--border-card)', background: 'transparent', color: 'var(--text-main)', cursor: 'pointer' }}>Cancel</button>
          </form>
        )}
      </div>

      {/* Spending Alerts */}
      {usagePercentage > 100 ? (
        <div className="alert-banner" style={{
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          borderLeft: '4px solid #ef4444',
          padding: '1rem',
          borderRadius: '4px',
          color: '#ef4444',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          fontWeight: 500,
          animation: 'fadein 0.3s ease'
        }}>
          <span>🚨</span> Budget Exceeded! You have exceeded your budget by {formatCurrency(Math.abs(remainingBudget))}.
        </div>
      ) : usagePercentage >= 80 ? (
        <div className="alert-banner" style={{
          backgroundColor: 'rgba(245, 158, 11, 0.1)',
          borderLeft: '4px solid #f59e0b',
          padding: '1rem',
          borderRadius: '4px',
          color: '#f59e0b',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          fontWeight: 500,
          animation: 'fadein 0.3s ease'
        }}>
          <span>⚠️</span> You have used {usagePercentage.toFixed(1)}% of your monthly budget.
        </div>
      ) : null}

      <BudgetSummary 
        budget={budget} 
        totalSpent={totalSpent} 
        remainingBudget={remainingBudget} 
        usagePercentage={usagePercentage} 
      />

      <BudgetProgressBar 
        budget={budget} 
        remainingBudget={remainingBudget} 
        usagePercentage={usagePercentage} 
      />

    </div>
  );
}

export default BudgetManager;
