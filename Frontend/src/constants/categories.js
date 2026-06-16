export const CATEGORIES = [
  { id: 'food', name: 'Food & Dining', icon: '🍔', color: '#f59e0b', bgColor: 'rgba(245, 158, 11, 0.12)' },
  { id: 'transport', name: 'Transport', icon: '🚗', color: '#3b82f6', bgColor: 'rgba(59, 130, 246, 0.12)' },
  { id: 'shopping', name: 'Shopping', icon: '🛍️', color: '#ec4899', bgColor: 'rgba(236, 72, 153, 0.12)' },
  { id: 'utilities', name: 'Utilities & Bills', icon: '💡', color: '#10b981', bgColor: 'rgba(16, 185, 129, 0.12)' },
  { id: 'entertainment', name: 'Entertainment', icon: '🎬', color: '#8b5cf6', bgColor: 'rgba(139, 92, 246, 0.12)' },
  { id: 'health', name: 'Health & Fitness', icon: '🏥', color: '#ef4444', bgColor: 'rgba(239, 68, 68, 0.12)' },
  { id: 'education', name: 'Education', icon: '📚', color: '#06b6d4', bgColor: 'rgba(6, 182, 212, 0.12)' },
  { id: 'others', name: 'Others', icon: '📝', color: '#6b7280', bgColor: 'rgba(107, 114, 128, 0.12)' },
];

export const getCategoryById = (id) => {
  return CATEGORIES.find(c => c.id === id) || CATEGORIES[CATEGORIES.length - 1];
};
