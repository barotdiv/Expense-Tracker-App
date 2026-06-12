import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import StatsGrid from './components/StatsGrid';
import ExpenseForm from './components/ExpenseForm';
import ExpenseList from './components/ExpenseList';
import CategoryBreakdown from './components/CategoryBreakdown';
import './App.css';

// Initial default expenses to make the app look stunning on first load
const INITIAL_EXPENSES = [
  { id: 'ex-1', title: 'Organic Groceries', amount: 82.50, category: 'food', date: '2026-06-10' },
  { id: 'ex-2', title: 'Monthly Subway Pass', amount: 120.00, category: 'transport', date: '2026-06-09' },
  { id: 'ex-3', title: 'Cinema Tickets & Popcorn', amount: 32.00, category: 'entertainment', date: '2026-06-08' },
  { id: 'ex-4', title: 'Vaporwave Keyboard Keycaps', amount: 65.00, category: 'shopping', date: '2026-06-05' },
];

const INITIAL_BUDGET = 2000;

function App() {
  // Load initial expenses from localStorage, or use dummy items if first visit
  const [expenses, setExpenses] = useState(() => {
    const savedExpenses = localStorage.getItem('spendwise_expenses');
    if (savedExpenses) {
      try {
        return JSON.parse(savedExpenses);
      } catch (e) {
        console.error('Failed to parse expenses:', e);
      }
    }
    return INITIAL_EXPENSES;
  });

  // Load budget from localStorage or use default budget
  const [budget, setBudget] = useState(() => {
    const savedBudget = localStorage.getItem('spendwise_budget');
    if (savedBudget) {
      const parsed = parseFloat(savedBudget);
      if (!isNaN(parsed) && parsed >= 0) {
        return parsed;
      }
    }
    return INITIAL_BUDGET;
  });

  // Persist expenses to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('spendwise_expenses', JSON.stringify(expenses));
  }, [expenses]);

  // Persist budget to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('spendwise_budget', budget.toString());
  }, [budget]);

  // Handler to add a new expense
  const handleAddExpense = (newExpense) => {
    setExpenses((prevExpenses) => [newExpense, ...prevExpenses]);
  };

  // Handler to delete an expense by id
  const handleDeleteExpense = (id) => {
    setExpenses((prevExpenses) => prevExpenses.filter((item) => item.id !== id));
  };

  return (
    <>
      {/* Decorative moving blur backgrounds */}
      <div className="gradient-bg" aria-hidden="true">
        <div className="gradient-blob-1"></div>
        <div className="gradient-blob-2"></div>
      </div>

      <div className="app-container animate-fadein">
        {/* Header section */}
        <Header expenseCount={expenses.length} />

        {/* Dashboard overview stats: Budget, Spent, Remaining */}
        <StatsGrid 
          expenses={expenses} 
          budget={budget} 
          onSetBudget={setBudget} 
        />

        {/* Core Workspace */}
        <main className="dashboard-grid">
          {/* Left column: Add Expense form & Category Breakdown stats */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <ExpenseForm onAddExpense={handleAddExpense} />
            <CategoryBreakdown expenses={expenses} />
          </div>

          {/* Right column: Search, Filter, Sort, and Expense List */}
          <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100%' }}>
            <ExpenseList 
              expenses={expenses} 
              onDeleteExpense={handleDeleteExpense} 
            />
          </div>
        </main>

        {/* Footer */}
        <footer className="app-footer">
          <p>© {new Date().getFullYear()} SpendWise. Created using React & Vanilla CSS.</p>
        </footer>
      </div>
    </>
  );
}

export default App;
