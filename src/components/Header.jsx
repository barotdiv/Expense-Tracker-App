import React from 'react';

function Header({ expenseCount }) {
  return (
    <header className="app-header">
      <div className="logo-section">
        <div className="logo-icon" aria-hidden="true">
          <span>💸</span>
        </div>
        <div>
          <h1>SpendWise</h1>
          <p className="subtitle">Track your wealth, filter details & manage budgets</p>
        </div>
      </div>
      <div className="version-badge">
        {expenseCount === 0 
          ? 'No expenses tracked' 
          : `${expenseCount} ${expenseCount === 1 ? 'expense' : 'expenses'} logged`}
      </div>
    </header>
  );
}

export default Header;
