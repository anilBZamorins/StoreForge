/**
 * useMocks: true  → every DataService method returns data from src/app/mock.ts
 * useMocks: false → every DataService method calls the Laravel API at apiUrl
 * Flip this one flag to switch the whole app between mock data and the real API.
 */
export const environment = {
  production: false,
  useMocks: true,
  apiUrl: '/api/v1',
};
