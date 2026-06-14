import React, { useState } from 'react';
import { CATEGORIES } from '../constants/categories';

const DESCRIPTION_SUGGESTIONS = {
  food: ['Groceries', 'Restaurant', 'Coffee', 'Snacks'],
  transport: ['Gas', 'Uber/Lyft', 'Transit', 'Car Repair'],
  shopping: ['Clothing', 'Electronics', 'Home Goods', 'Gifts'],
  utilities: ['Electricity', 'Water', 'Internet', 'Phone'],
  entertainment: ['Movies', 'Concert', 'Video Games', 'Streaming'],
  health: ['Doctor', 'Pharmacy', 'Gym', 'Dentist'],
  education: ['Tuition', 'Books', 'Course', 'Supplies'],
  others: ['Donation', 'Pet', 'Misc', 'Personal Care'],
};

function ExpenseForm({ onAddExpense }) {
  const getTodayDateString = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0].id);
  const [date, setDate] = useState(getTodayDateString());

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title.trim()) return;
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) return;

    const newExpense = {
      id: Date.now().toString(),
      title: title.trim(),
      amount: parsedAmount,
      category,
      date: date || getTodayDateString()
    };

    onAddExpense(newExpense);

    // Reset inputs except category and date for convenience
    setTitle('');
    setAmount('');
  };

  return (
    <div className="card animate-slideup">
      <h2 className="card-title">
        <span>➕</span> Add New Expense
      </h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {/* Title Input */}
        <div className="form-group">
          <label htmlFor="expense-title" className="form-label">Description</label>
          <input
            type="text"
            id="expense-title"
            className="form-input"
            placeholder="e.g. Groceries, Netflix subscription"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            maxLength={60}
          />
          {/* AI Suggestions for Description based on Category */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.5rem' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', alignSelf: 'center' }}>💡 Suggestions:</span>
            {DESCRIPTION_SUGGESTIONS[category]?.map((suggestion, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setTitle(suggestion)}
                style={{
                  fontSize: '0.75rem',
                  padding: '0.2rem 0.6rem',
                  borderRadius: '12px',
                  border: '1px solid var(--border-card, #e2e8f0)',
                  backgroundColor: title === suggestion ? 'var(--primary, #3b82f6)' : 'var(--bg-secondary, #f8fafc)',
                  color: title === suggestion ? '#fff' : 'var(--text-main, #1e293b)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>

        {/* Amount Input */}
        <div className="form-group">
          <label htmlFor="expense-amount" className="form-label">Amount ($)</label>
          <input
            type="number"
            id="expense-amount"
            className="form-input"
            placeholder="0.00"
            step="any"
            min="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </div>

        {/* Category & Date Grid */}
        <div className="form-grid-2">
          <div className="form-group">
            <label htmlFor="expense-category" className="form-label">Category</label>
            <select
              id="expense-category"
              className="form-select"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            >
              {CATEGORIES.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.icon} {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="expense-date" className="form-label">Date</label>
            <input
              type="date"
              id="expense-date"
              className="form-input"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>
        </div>

        {/* Submit button */}
        <button type="submit" className="btn-submit">
          <span>Add Expense</span>
        </button>
      </form>
    </div>
  );
}

export default ExpenseForm;
