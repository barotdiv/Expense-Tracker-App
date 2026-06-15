import React from 'react';

function BudgetSummary({ budget, totalSpent, remainingBudget, usagePercentage }) {
  const isNegative = remainingBudget < 0;

  // Format currency
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2
    }).format(value);
  };

  return (
    <div className="stats-grid animate-fadein">
      {/* Monthly Budget Card */}
      <div className="stat-card budget">
        <span className="stat-label">Monthly Budget</span>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem' }}>
          <span className="stat-val">{formatCurrency(budget)}</span>
        </div>
      </div>

      {/* Total Spent Card */}
      <div className="stat-card spent">
        <span className="stat-label">Total Spent This Month</span>
        <span className="stat-val">{formatCurrency(totalSpent)}</span>
      </div>

      {/* Remaining Budget Card */}
      <div className={`stat-card remaining ${isNegative ? 'negative' : ''}`}>
        <span className="stat-label">{isNegative ? 'Overspent By' : 'Remaining Budget'}</span>
        <span className="stat-val" style={{ color: isNegative ? 'var(--accent)' : 'var(--secondary)' }}>
          {formatCurrency(Math.abs(remainingBudget))}
        </span>
      </div>

      {/* Budget Usage Percentage Card */}
      <div className="stat-card">
        <span className="stat-label">Budget Usage</span>
        <span className="stat-val">{usagePercentage.toFixed(1)}%</span>
      </div>
    </div>
  );
}

export default BudgetSummary;
