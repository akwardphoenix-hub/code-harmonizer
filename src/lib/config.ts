/**
 * Runtime configuration for the application
 * Determines offline mode, base URLs, and testing flags
 */

export const OFFLINE = 
  import.meta.env.VITE_OFFLINE === 'true' || 
  !!import.meta.env.CI || 
  import.meta.env.MODE === 'test';

export const BASE_URL = 
  import.meta.env.VITE_BASE_URL || 
  'http://127.0.0.1:4173';

export const IS_TEST = import.meta.env.MODE === 'test';

export const IS_CI = !!import.meta.env.CI;
