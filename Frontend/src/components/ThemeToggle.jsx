import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toggleTheme } from '../store/themeSlice';

function ThemeToggle() {
  const dispatch = useDispatch();
  const mode = useSelector((state) => state.theme?.mode || 'dark');
  const isDark = mode === 'dark';

  return (
    <button
      type="button"
      className="theme-toggle-btn"
      onClick={() => dispatch(toggleTheme())}
      title={`Switch to ${isDark ? 'Light' : 'Dark'} Mode`}
      aria-label={`Switch to ${isDark ? 'Light' : 'Dark'} Mode`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.45rem',
        padding: '0.45rem 0.85rem',
        borderRadius: '9999px',
        border: '1px solid var(--border-card)',
        backgroundColor: 'var(--bg-card)',
        color: 'var(--text-main)',
        cursor: 'pointer',
        fontSize: '0.85rem',
        fontWeight: 600,
        boxShadow: 'var(--shadow-sm)',
        transition: 'all 0.25s ease'
      }}
    >
      <span style={{ fontSize: '1rem', lineHeight: 1 }}>{isDark ? '☀️' : '🌙'}</span>
      <span>{isDark ? 'Light Mode' : 'Dark Mode'}</span>
    </button>
  );
}

export default ThemeToggle;
