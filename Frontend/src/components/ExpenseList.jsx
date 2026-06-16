import React, { useState } from 'react';
import { CATEGORIES, getCategoryById } from '../constants/categories';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

function ExpenseList({ expenses, onDeleteExpense, onEditExpense }) {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date-desc'); // date-desc, date-asc, amount-desc, amount-asc
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const [editingId, setEditingId] = useState(null);
  const [editAmount, setEditAmount] = useState('');

  // 1. Filter expenses
  const filteredExpenses = expenses.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
    
    let matchesDate = true;
    if (startDate) {
      matchesDate = matchesDate && new Date(item.date) >= new Date(startDate);
    }
    if (endDate) {
      matchesDate = matchesDate && new Date(item.date) <= new Date(endDate);
    }

    return matchesSearch && matchesCategory && matchesDate;
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

  // Summary
  const totalFilteredAmount = filteredExpenses.reduce((sum, item) => sum + item.amount, 0);
  const totalFilteredCount = filteredExpenses.length;

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

  // Exports
  const exportToCSV = () => {
    if (sortedExpenses.length === 0) return;
    
    // Headers
    const headers = ['Date', 'Description', 'Category', 'Amount'];
    
    // Rows
    const rows = sortedExpenses.map(item => {
      const cat = getCategoryById(item.category);
      // Escape strings containing commas by wrapping in quotes
      const desc = `"${item.title.replace(/"/g, '""')}"`;
      return [`"${formatDate(item.date)}"`, desc, `"${cat.name}"`, item.amount];
    });

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `expenses_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToPDF = () => {
    if (sortedExpenses.length === 0) return;

    const doc = new jsPDF();
    doc.text('Expense Report', 14, 15);
    doc.setFontSize(10);
    doc.text(`Total Transactions: ${totalFilteredCount}`, 14, 22);
    doc.text(`Total Amount: ${formatCurrency(totalFilteredAmount)}`, 14, 28);

    if (startDate || endDate) {
      doc.text(`Date Range: ${startDate || 'Any'} to ${endDate || 'Any'}`, 14, 34);
    }

    const tableData = sortedExpenses.map(item => {
      const cat = getCategoryById(item.category);
      return [formatDate(item.date), item.title, cat.name, formatCurrency(item.amount)];
    });

    autoTable(doc, {
      startY: (startDate || endDate) ? 40 : 35,
      head: [['Date', 'Description', 'Category', 'Amount']],
      body: tableData,
    });

    doc.save(`expenses_export_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  return (
    <div className="card animate-slideup" style={{ flexGrow: 1 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
        <h2 className="card-title" style={{ marginBottom: 0 }}>
          <span>📋</span> Expense History
        </h2>
        
        {/* Export Buttons */}
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button 
            onClick={exportToCSV} 
            disabled={sortedExpenses.length === 0}
            className="btn" 
            style={{ padding: '0.4rem 0.8rem', fontSize: '0.9rem', backgroundColor: 'var(--bg-main)', color: 'var(--text-main)', border: '1px solid var(--border-card)', opacity: sortedExpenses.length === 0 ? 0.5 : 1, cursor: sortedExpenses.length === 0 ? 'not-allowed' : 'pointer' }}>
            📊 Export CSV
          </button>
          <button 
            onClick={exportToPDF} 
            disabled={sortedExpenses.length === 0}
            className="btn" 
            style={{ padding: '0.4rem 0.8rem', fontSize: '0.9rem', backgroundColor: 'var(--bg-main)', color: 'var(--text-main)', border: '1px solid var(--border-card)', opacity: sortedExpenses.length === 0 ? 0.5 : 1, cursor: sortedExpenses.length === 0 ? 'not-allowed' : 'pointer' }}>
            📄 Export PDF
          </button>
        </div>
      </div>

      {/* Summary Section */}
      <div style={{ display: 'flex', gap: '2rem', padding: '1rem', backgroundColor: 'var(--bg-main)', borderRadius: '8px', marginBottom: '1.5rem', border: '1px solid var(--border-card)' }}>
        <div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Filtered Transactions</div>
          <div style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-main)' }}>{totalFilteredCount}</div>
        </div>
        <div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Filtered Total Amount</div>
          <div style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--primary)' }}>{formatCurrency(totalFilteredAmount)}</div>
        </div>
      </div>

      {/* Filters and Search Panel */}
      <div className="filters-container" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {/* Search & Date */}
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <div className="search-input-wrapper" style={{ flexGrow: 1, minWidth: '200px' }}>
            <span className="search-icon" aria-hidden="true">🔍</span>
            <input
              type="text"
              className="search-input"
              placeholder="Search expenses by description..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Date Filters */}
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <input 
              type="date" 
              value={startDate} 
              onChange={(e) => setStartDate(e.target.value)}
              className="filter-select"
              title="Start Date"
            />
            <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>to</span>
            <input 
              type="date" 
              value={endDate} 
              onChange={(e) => setEndDate(e.target.value)}
              className="filter-select"
              title="End Date"
            />
          </div>
        </div>

        {/* Filter and Sort options */}
        <div className="filter-actions" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <select
            className="filter-select"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            aria-label="Filter by category"
            style={{ flexGrow: 1 }}
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
            style={{ flexGrow: 1 }}
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

                <div className="expense-info-right" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  {editingId === item.id ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <input
                        type="number"
                        value={editAmount}
                        onChange={(e) => setEditAmount(e.target.value)}
                        style={{ width: '80px', padding: '0.3rem', borderRadius: '4px', border: '1px solid var(--border-card, #ccc)', background: 'var(--bg-main)', color: 'var(--text-main)' }}
                        min="0.01"
                        step="any"
                        autoFocus
                      />
                      <button
                        onClick={() => {
                          if (editAmount && parseFloat(editAmount) > 0) {
                            onEditExpense(item.id, editAmount);
                            setEditingId(null);
                          }
                        }}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1rem', padding: '0.2rem' }}
                        title="Save amount"
                      >
                        ✅
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1rem', padding: '0.2rem' }}
                        title="Cancel edit"
                      >
                        ❌
                      </button>
                    </div>
                  ) : (
                    <>
                      <span className="expense-amount">
                        {formatCurrency(item.amount)}
                      </span>
                      <button
                        onClick={() => {
                          setEditingId(item.id);
                          setEditAmount(item.amount);
                        }}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1rem', padding: '0.2rem', opacity: 0.7 }}
                        onMouseOver={(e) => e.currentTarget.style.opacity = 1}
                        onMouseOut={(e) => e.currentTarget.style.opacity = 0.7}
                        title="Edit amount"
                        aria-label={`Edit expense amount: ${item.title}`}
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => onDeleteExpense(item.id)}
                        className="btn-delete"
                        title="Delete expense"
                        aria-label={`Delete expense: ${item.title}`}
                      >
                        🗑️
                      </button>
                    </>
                  )}
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
