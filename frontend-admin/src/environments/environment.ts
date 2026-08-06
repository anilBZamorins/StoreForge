/**
 * useMocks: true  → every DataService method returns data from src/app/mock.ts
 * useMocks: false → every DataService method calls the Laravel API at apiUrl
 * Flip this one flag to switch the whole app between mock data and the real API.
 */
export const environment = {
  production: true,
  useMocks: false,
  apiUrl: 'http://localhost:8000/api/v1',
};
