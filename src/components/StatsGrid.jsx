import React, { useState } from 'react';

function StatsGrid({ expenses, budget, onSetBudget }) {
  const [isEditingBudget, setIsEditingBudget] = useState(false);
  const [tempBudget, setTempBudget] = useState(budget.toString());

  const totalSpent = expenses.reduce((sum, item) => sum + item.amount, 0);
  const remaining = budget - totalSpent;
  const isNegative = remaining < 0;

  // Format currency
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 2
    }).format(value);
  };

  const handleBudgetSubmit = (e) => {
    e.preventDefault();
    const newBudget = parseFloat(tempBudget);
    if (!isNaN(newBudget) && newBudget >= 0) {
      onSetBudget(newBudget);
      setIsEditingBudget(false);
    }
  };

  // Progress bar logic
  const progressPercent = budget > 0 ? Math.min((totalSpent / budget) * 100, 100) : 0;
  
  let progressClass = '';
  if (progressPercent >= 90) {
    progressClass = 'danger';
  } else if (progressPercent >= 75) {
    progressClass = 'warning';
  }

  return (
    <div className="stats-container animate-fadein" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div className="stats-grid">
        {/* Budget Card */}
        <div className="stat-card budget">
          <span className="stat-label">Monthly Budget</span>
          {isEditingBudget ? (
            <form onSubmit={handleBudgetSubmit} className="budget-input-wrapper">
              <input
                type="number"
                step="any"
                min="0"
                className="budget-mini-input"
                value={tempBudget}
                onChange={(e) => setTempBudget(e.target.value)}
                autoFocus
                required
              />
              <button type="submit" className="budget-btn" aria-label="Save Budget">✓</button>
              <button 
                type="button" 
                className="budget-btn" 
                style={{ backgroundColor: 'var(--text-muted)' }} 
                onClick={() => {
                  setTempBudget(budget.toString());
                  setIsEditingBudget(false);
                }}
                aria-label="Cancel"
              >
                ✕
              </button>
            </form>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem' }}>
              <span className="stat-val">{formatCurrency(budget)}</span>
              <button 
                className="budget-btn" 
                onClick={() => {
                  setTempBudget(budget.toString());
                  setIsEditingBudget(true);
                }}
                title="Edit Budget"
                aria-label="Edit Budget"
              >
                ✏️
              </button>
            </div>
          )}
        </div>

        {/* Spent Card */}
        <div className="stat-card spent">
          <span className="stat-label">Total Spent</span>
          <span className="stat-val">{formatCurrency(totalSpent)}</span>
        </div>

        {/* Remaining Card */}
        <div className={`stat-card remaining ${isNegative ? 'negative' : ''}`}>
          <span className="stat-label">{isNegative ? 'Overspent By' : 'Remaining'}</span>
          <span className="stat-val" style={{ color: isNegative ? 'var(--accent)' : 'var(--secondary)' }}>
            {formatCurrency(Math.abs(remaining))}
          </span>
        </div>
      </div>

      {/* Budget Progress Bar */}
      {budget > 0 && (
        <div className="card budget-progress-container animate-fadein" style={{ padding: '1.25rem', gap: '0.75rem' }}>
          <div className="progress-header">
            <span>Budget Utilization</span>
            <span>{progressPercent.toFixed(0)}% Used</span>
          </div>
          <div className="progress-bar-bg" role="progressbar" aria-valuenow={progressPercent} aria-valuemin="0" aria-valuemax="100">
            <div 
              className={`progress-bar-fill ${progressClass}`} 
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 500 }}>
            {isNegative 
              ? `You've exceeded your budget by ${formatCurrency(Math.abs(remaining))}!` 
              : `${formatCurrency(remaining)} remaining of your ${formatCurrency(budget)} budget.`}
          </span>
        </div>
      )}
    </div>
  );
}

export default StatsGrid;
