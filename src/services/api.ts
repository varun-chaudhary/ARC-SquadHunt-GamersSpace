
// This file is kept for backward compatibility
// It re-exports all services from the new modular structure

import apiClient from './apiClient';
export * from './authService';
export * from './userService';
export * from './opportunityService';
export * from './organizerService';
export * from './playerService';

export default apiClient;
