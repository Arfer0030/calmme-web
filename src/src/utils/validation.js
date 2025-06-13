export const validation = {
  isValidEmail: (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  isValidUsername: (username) => {
    return username.length >= 3 && /^[a-zA-Z0-9_]+$/.test(username);
  },

  isValidPassword: (password) => {
    return password.length >= 6;
  },
};
