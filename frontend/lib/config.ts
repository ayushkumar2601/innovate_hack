// lib/config.ts

/**
 * API Configuration for Innovat3
 * This file centralizes all API endpoint configuration
 */

// Determine the base URL based on environment
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// Log which environment we're in (helpful for debugging)
if (process.env.NODE_ENV === 'development') {
  console.log('🔧 Development mode - API URL:', API_BASE_URL);
} else {
  console.log('🚀 Production mode - API URL:', API_BASE_URL);
}

// Helper function to build full API URLs
export const getApiUrl = (endpoint: string): string => {
  // Remove leading slash if present to avoid double slashes
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
  return `${API_BASE_URL}/${cleanEndpoint}`;
};

// API endpoints for easy reference
export const API_ENDPOINTS = {
  AGENTS: '/agents',
  AGENTS_SEARCH: '/agents/search',
  AGENTS_CATEGORIES: '/agents/categories',
  EXECUTE_AGENT: '/execute-agent',
  RATE_AGENT: '/rate-agent',
  DASHBOARD: (wallet: string) => `/dashboard/${wallet}`,
  LEADERBOARD: '/leaderboard',
  STATS: '/stats',
  HEALTH: '/health',
} as const;