
import apiClient from './apiClient';

// Re-export all services
export * from './authService';
export * from './userService';
export * from './opportunityService';
export * from './organizerService';
export * from './playerService';

// Export the API client and mock flag
export default apiClient;
