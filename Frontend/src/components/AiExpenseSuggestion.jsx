import React, { useMemo } from 'react';
import './AiExpenseSuggestion.css';

const AiExpenseSuggestion = ({ expenses, budget }) => {
  const insights = useMemo(() => {
    if (!expenses || expenses.length === 0) {
      return null;
    }

    // 1 & 2: Highest and Lowest Category
    const categoryTotals = expenses.reduce((acc, curr) => {
      acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
      return acc;
    }, {});

    const categories = Object.keys(categoryTotals);
    let highestCategory = categories[0];
    let lowestCategory = categories[0];

    categories.forEach(cat => {
      if (categoryTotals[cat] > categoryTotals[highestCategory]) highestCategory = cat;
      if (categoryTotals[cat] < categoryTotals[lowestCategory]) lowestCategory = cat;
    });

    const totalSpent = expenses.reduce((sum, exp) => sum + exp.amount, 0);
    const highestAmount = categoryTotals[highestCategory];
    const lowestAmount = categoryTotals[lowestCategory];

    // 3: Key Insights (Unusual spending)
    let unusualSpending = [];
    if (highestAmount > budget * 0.5) {
      unusualSpending.push(`You are spending a large portion of your budget (${((highestAmount / totalSpent) * 100).toFixed(1)}%) on ${highestCategory}.`);
    }
    if (totalSpent > budget) {
      unusualSpending.push("You have exceeded your total monthly budget!");
    } else if (totalSpent > budget * 0.9) {
      unusualSpending.push("You are very close to reaching your budget limit.");
    }
    if (unusualSpending.length === 0) {
      unusualSpending.push("Your spending habits look well-balanced and healthy.");
    }

    // 4: Saving Tips
    let savingTips = [];
    if (highestCategory === 'Food' || highestCategory === 'Dining' || highestCategory === 'Groceries') {
      savingTips = [
        "Plan your meals for the week to avoid ordering out.",
        "Buy groceries in bulk and look for discounts.",
        "Limit eating out or ordering delivery to once a week."
      ];
    } else if (highestCategory === 'Entertainment') {
      savingTips = [
        "Cancel unused subscriptions (streaming, gym, etc.).",
        "Look for free community events and outdoor activities.",
        "Set a strict monthly limit for fun and stick to it."
      ];
    } else if (highestCategory === 'Transport' || highestCategory === 'Transportation') {
      savingTips = [
        "Consider carpooling, biking, or using public transportation.",
        "Combine errands to save on fuel.",
        "Regularly check your vehicle's tire pressure to improve gas mileage."
      ];
    } else if (highestCategory === 'Shopping') {
      savingTips = [
        "Implement a '24-hour rule' before making non-essential purchases.",
        "Buy second-hand items when possible.",
        "Unsubscribe from promotional emails to avoid temptation."
      ];
    } else {
      savingTips = [
        "Track every single expense to find hidden leaks.",
        "Automate a transfer to your savings account each payday.",
        "Review your recurring bills and negotiate better rates."
      ];
    }

    // 5: Budget Recommendation
    const recommendedBudget = Math.max(0, highestAmount * 0.85); // Suggest 15% reduction

    // 6: Financial Health Score
    let score = 100;
    if (totalSpent > budget) score -= 40;
    else if (totalSpent > budget * 0.9) score -= 20;
    else if (totalSpent < budget * 0.5) score += 10;

    if (highestAmount > budget * 0.5) score -= 15;

    score = Math.max(0, Math.min(100, score)); // Clamp between 0 and 100

    return {
      highestCategory,
      highestAmount,
      lowestCategory,
      lowestAmount,
      unusualSpending,
      savingTips,
      recommendedBudget,
      score
    };
  }, [expenses, budget]);

  if (!insights) {
    return (
      <div className="card ai-suggestion-card">
        <h3 className="card-title"><span className="ai-icon-pulse">✨</span> AI Financial Advisor</h3>
        <div className="empty-state">
          <div className="empty-icon">📊</div>
          <p className="empty-text">Add some expenses to get personalized AI insights!</p>
        </div>
      </div>
    );
  }

  // Get color for score
  let scoreColor = 'var(--secondary)'; // Green
  if (insights.score < 50) scoreColor = 'var(--accent)'; // Red
  else if (insights.score < 80) scoreColor = '#f59e0b'; // Yellow

  return (
    <div className="card ai-suggestion-card animate-slideup">
      <h3 className="card-title">
        <span className="ai-icon-pulse">✨</span> AI Financial Advisor
      </h3>

      <div className="ai-content">
        {/* Spending Summary */}
        <div className="insight-section">
          <h4 className="insight-title">📊 Spending Summary</h4>
          <div className="insight-body">
            <div className="summary-item">
              <span className="summary-label">Highest Spend:</span>
              <span className="summary-value highlight-bad">{insights.highestCategory} (${insights.highestAmount.toFixed(2)})</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Lowest Spend:</span>
              <span className="summary-value highlight-good">{insights.lowestCategory} (${insights.lowestAmount.toFixed(2)})</span>
            </div>
          </div>
        </div>

        {/* Key Insights */}
        <div className="insight-section">
          <h4 className="insight-title">🔍 Key Insights</h4>
          <ul className="insight-list">
            {insights.unusualSpending.map((insight, idx) => (
              <li key={idx}>{insight}</li>
            ))}
          </ul>
        </div>

        {/* Saving Tips */}
        <div className="insight-section">
          <h4 className="insight-title">💡 Saving Tips</h4>
          <ul className="insight-list tips-list">
            {insights.savingTips.map((tip, idx) => (
              <li key={idx}>{tip}</li>
            ))}
          </ul>
        </div>

        {/* Budget Recommendation */}
        <div className="insight-section">
          <h4 className="insight-title">🎯 Budget Recommendation</h4>
          <div className="recommendation-box">
            <p>Target for <strong>{insights.highestCategory}</strong> next month:</p>
            <div className="recommended-amount">${insights.recommendedBudget.toFixed(2)}</div>
            <p className="recommendation-subtext">Cutting back by ~15% helps build your savings.</p>
          </div>
        </div>

        {/* Health Score */}
        <div className="insight-section health-score-section">
          <h4 className="insight-title">⭐ Financial Health Score</h4>
          <div className="score-container">
            <svg viewBox="0 0 36 36" className="circular-chart">
              <path className="circle-bg"
                d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path className="circle"
                strokeDasharray={`${insights.score}, 100`}
                style={{ stroke: scoreColor }}
                d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <text x="18" y="20.35" className="percentage">{insights.score}</text>
            </svg>
            <div className="score-text">
              {insights.score >= 80 ? 'Excellent! You are on track.' :
                insights.score >= 50 ? 'Good, but there is room for improvement.' :
                  'Needs attention. Please review your spending!'}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AiExpenseSuggestion;
