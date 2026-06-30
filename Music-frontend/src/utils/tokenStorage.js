const TOKEN_KEY = 'refreshToken';

export const getRefreshToken = () => localStorage.getItem(TOKEN_KEY);
export const setRefreshToken = (token) => localStorage.setItem(TOKEN_KEY, token);
export const removeRefreshToken = () => localStorage.removeItem(TOKEN_KEY);
