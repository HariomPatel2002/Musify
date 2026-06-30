import { fetchBaseQuery } from '@reduxjs/toolkit/query';
import { setCredentials, logout } from '../features/auth/authSlice';
import { getRefreshToken, setRefreshToken, removeRefreshToken } from '../utils/tokenStorage';

const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_URL,
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.accessToken;
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

export const reauthBaseQuery = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    const refreshToken = getRefreshToken();

    if (!refreshToken) {
      api.dispatch(logout());
      removeRefreshToken();
      return result;
    }

    const refreshResult = await baseQuery(
      {
        url: '/auth/refresh',
        method: 'POST',
        body: { refreshToken },
      },
      api,
      extraOptions
    );

    if (refreshResult.data) {
      const { accessToken, refreshToken: newRefreshToken } = refreshResult.data.data;
      const currentUser = api.getState().auth.user;
      if (currentUser) {
        api.dispatch(setCredentials({ user: currentUser, accessToken }));
      } else {
        api.dispatch({ type: 'auth/setAccessToken', payload: accessToken });
      }
      setRefreshToken(newRefreshToken);

      result = await baseQuery(args, api, extraOptions);
    } else {
      api.dispatch(logout());
      removeRefreshToken();
    }
  }

  return result;
};
