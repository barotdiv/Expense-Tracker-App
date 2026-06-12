import React, { useState } from 'react';
import { CATEGORIES, getCategoryById } from '../constants/categories';

function ExpenseList({ expenses, onDeleteExpense }) {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date-desc'); // date-desc, date-asc, amount-desc, amount-asc

  // 1. Filter expenses
  const filteredExpenses = expenses.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  // 2. Sort expenses
  const sortedExpenses = [...filteredExpenses].sort((a, b) => {
    if (sortBy === 'date-desc') {
      return new Date(b.date) - new Date(a.date) || b.id.localeCompare(a.id);
    } else if (sortBy === 'date-asc') {
      return new Date(a.date) - new Date(b.date) || a.id.localeCompare(b.id);
    } else if (sortBy === 'amount-desc') {
      return b.amount - a.amount;
    } else if (sortBy === 'amount-asc') {
      return a.amount - b.amount;
    }
    return 0;
  });

  // Format currency
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 2
    }).format(value);
  };

  // Format date nicely
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="card animate-slideup" style={{ flexGrow: 1 }}>
      <h2 className="card-title">
        <span>📋</span> Expense History
      </h2>

      {/* Filters and Search Panel */}
      <div className="filters-container">
        {/* Search */}
        <div className="search-input-wrapper">
          <span className="search-icon" aria-hidden="true">🔍</span>
          <input
            type="text"
            className="search-input"
            placeholder="Search expenses by description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Filter and Sort options */}
        <div className="filter-actions">
          <select
            className="filter-select"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            aria-label="Filter by category"
          >
            <option value="all">All Categories</option>
            {CATEGORIES.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.icon} {cat.name}
              </option>
            ))}
          </select>

          <select
            className="filter-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            aria-label="Sort expenses"
          >
            <option value="date-desc">Newest First</option>
            <option value="date-asc">Oldest First</option>
            <option value="amount-desc">Amount: High to Low</option>
            <option value="amount-asc">Amount: Low to High</option>
          </select>
        </div>
      </div>

      {/* Expense Items List */}
      <div className="expense-list">
        {sortedExpenses.length > 0 ? (
          sortedExpenses.map((item) => {
            const cat = getCategoryById(item.category);
            return (
              <div key={item.id} className="expense-item">
                <div className="expense-info-left">
                  <div 
                    className="category-icon-pill" 
                    style={{ backgroundColor: cat.bgColor, color: cat.color }}
                    aria-hidden="true"
                  >
                    {cat.icon}
                  </div>
                  <div className="expense-details">
                    <span className="expense-title" title={item.title}>
                      {item.title}
                    </span>
                    <div className="expense-meta">
                      <span className="expense-cat-name" style={{ color: cat.color }}>
                        {cat.name}
                      </span>
                      <span>•</span>
                      <time dateTime={item.date}>{formatDate(item.date)}</time>
                    </div>
                  </div>
                </div>

                <div className="expense-info-right">
                  <span className="expense-amount">
                    {formatCurrency(item.amount)}
                  </span>
                  <button
                    onClick={() => onDeleteExpense(item.id)}
                    className="btn-delete"
                    title="Delete expense"
                    aria-label={`Delete expense: ${item.title}`}
                  >
                    🗑️
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="empty-state animate-fadein">
            <div className="empty-icon" aria-hidden="true">🍃</div>
            <h3 style={{ color: 'var(--text-main)', fontSize: '1.1rem', fontWeight: 650 }}>
              No transactions found
            </h3>
            <p className="empty-text">
              {expenses.length === 0 
                ? "Get started by adding your first expense above!" 
                : "No items match your filter criteria."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ExpenseList;
