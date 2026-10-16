// Status display helpers
export const STATUS_LABELS: Record<string, string> = {
  pending_review: 'Pending Review',
  pending: 'Pending',
  assigned: 'Assigned',
  in_progress: 'In Progress',
  awaiting_verification: 'Awaiting Verification',
  resolved: 'Resolved',
  rejected: 'Rejected',
};

export const STATUS_COLORS: Record<string, string> = {
  pending_review: 'badge-yellow',
  pending: 'badge-yellow',
  assigned: 'badge-blue',
  in_progress: 'badge-teal',
  awaiting_verification: 'badge-purple',
  resolved: 'badge-green',
  rejected: 'badge-red',
};

export const CATEGORY_LABELS: Record<string, string> = {
  plastic: 'Plastic',
  paper: 'Paper & Cardboard',
  glass: 'Glass',
  metal: 'Metal',
  organic: 'Organic / Wet Waste',
  ewaste: 'E-Waste',
  mixed: 'Mixed Waste',
  other: 'Other',
};

export const CATEGORY_ICONS: Record<string, string> = {
  plastic: '♻️',
  paper: '📄',
  glass: '🍶',
  metal: '🥫',
  organic: '🌱',
  ewaste: '💻',
  mixed: '🗑️',
  other: '❓',
};

export const SEVERITY_COLORS: Record<string, string> = {
  low: 'badge-green',
  medium: 'badge-yellow',
  high: 'badge-red',
};

export const MAP_STATUS_COLORS: Record<string, string> = {
  pending_review: '#f59e0b',
  pending: '#f59e0b',
  assigned: '#3b82f6',
  in_progress: '#14b8a6',
  awaiting_verification: '#8b5cf6',
  resolved: '#22c55e',
  rejected: '#ef4444',
};

export const formatDate = (dateStr: string) => {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric',
  });
};

export const formatDateTime = (dateStr: string) => {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
  });
};

export const getImageUrl = (url: string) => {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  return `${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000'}${url}`;
};
