import React from 'react';

function Header({ expenseCount, username, onLogout }) {
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
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        {username && (
          <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>
            👤 Welcome, <span style={{ color: 'var(--primary)' }}>{username}</span>
          </div>
        )}
        <div className="version-badge">
          {expenseCount === 0 
            ? 'No expenses tracked' 
            : `${expenseCount} ${expenseCount === 1 ? 'expense' : 'expenses'} logged`}
        </div>
        {onLogout && (
          <button className="logout-btn" onClick={onLogout} title="Logout of SpendWise">
            <span>🚪</span> Logout
          </button>
        )}
      </div>
    </header>
  );
}

export default Header;
