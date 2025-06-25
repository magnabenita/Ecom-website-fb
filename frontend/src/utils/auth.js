// utils/auth.js
export const isLoggedIn = () => {
  // You can use a better system, but for now:
  return !!localStorage.getItem('user');
};
