import React from 'react';

function BudgetProgressBar({ budget, remainingBudget, usagePercentage }) {
  const isNegative = remainingBudget < 0;
  
  // Format currency for text
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2
    }).format(value);
  };

  const progressPercent = budget > 0 ? Math.min(usagePercentage, 100) : 0;
  
  let progressClass = '';
  if (usagePercentage > 100) {
    progressClass = 'danger';
  } else if (usagePercentage >= 80) {
    progressClass = 'warning';
  }

  if (budget <= 0) return null;

  return (
    <div className="card budget-progress-container animate-fadein" style={{ padding: '1.25rem', gap: '0.75rem', marginTop: '1rem' }}>
      <div className="progress-header">
        <span style={{ fontWeight: 600 }}>Budget Utilization</span>
        <span>{usagePercentage.toFixed(1)}% Used</span>
      </div>
      <div className="progress-bar-bg" role="progressbar" aria-valuenow={progressPercent} aria-valuemin="0" aria-valuemax="100">
        <div 
          className={`progress-bar-fill ${progressClass}`} 
          style={{ width: `${progressPercent}%`, transition: 'width 0.5s ease' }}
        ></div>
      </div>
      <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 500, display: 'block', marginTop: '0.5rem' }}>
        {isNegative 
          ? `You've exceeded your budget by ${formatCurrency(Math.abs(remainingBudget))}!` 
          : `${formatCurrency(remainingBudget)} remaining of your ${formatCurrency(budget)} budget.`}
      </span>
    </div>
  );
}

export default BudgetProgressBar;
