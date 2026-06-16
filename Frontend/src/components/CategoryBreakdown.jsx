import React from 'react';
import { CATEGORIES } from '../constants/categories';

function CategoryBreakdown({ expenses }) {
  const totalSpent = expenses.reduce((sum, item) => sum + item.amount, 0);

  // 1. Calculate spending per category
  const categorySpending = CATEGORIES.map((cat) => {
    const amount = expenses
      .filter((item) => item.category === cat.id)
      .reduce((sum, item) => sum + item.amount, 0);
    const percentage = totalSpent > 0 ? (amount / totalSpent) * 100 : 0;
    return { ...cat, amount, percentage };
  })
  // 2. Filter out categories with 0 spending and sort by amount descending
  .filter((cat) => cat.amount > 0)
  .sort((a, b) => b.amount - a.amount);

  // Format currency
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 2
    }).format(value);
  };

  if (categorySpending.length === 0) {
    return null; // Don't show anything if there are no expenses yet
  }

  return (
    <div className="card animate-slideup">
      <h2 className="card-title">
        <span>📊</span> Category Breakdown
      </h2>
      <div className="breakdown-list">
        {categorySpending.map((cat) => (
          <div key={cat.id} className="breakdown-item">
            <div className="breakdown-info">
              <span className="breakdown-label">
                <span>{cat.icon}</span>
                <span>{cat.name}</span>
                <span className="breakdown-percent">{cat.percentage.toFixed(0)}%</span>
              </span>
              <span className="breakdown-amount">{formatCurrency(cat.amount)}</span>
            </div>
            <div className="breakdown-bar-bg" role="progressbar" aria-valuenow={cat.percentage} aria-valuemin="0" aria-valuemax="100">
              <div 
                className="breakdown-bar-fill"
                style={{ 
                  width: `${cat.percentage}%`, 
                  backgroundColor: cat.color,
                  boxShadow: `0 2px 8px ${cat.bgColor}`
                }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CategoryBreakdown;
