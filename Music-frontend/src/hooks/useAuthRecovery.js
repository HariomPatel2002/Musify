import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useGetMeQuery } from '../api/authApi';
import { setCredentials, logout } from '../features/auth/authSlice';
import { getRefreshToken, removeRefreshToken } from '../utils/tokenStorage';

export default function useAuthRecovery() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const refreshToken = getRefreshToken();
  const { data, error, isLoading } = useGetMeQuery(undefined, {
    skip: !!user || !refreshToken,
  });

  useEffect(() => {
    if (user || !refreshToken) return;

    if (data?.data?._id) {
      dispatch(setCredentials({ user: data.data, accessToken: null }));
    }

    if (error) {
      dispatch(logout());
      removeRefreshToken();
    }
  }, [data, error, user, refreshToken, dispatch]);

  return { isLoading: isLoading && refreshToken && !user };
}
