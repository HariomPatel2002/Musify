import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import authReducer from '../features/auth/authSlice';
import playerReducer from '../features/player/playerSlice';
import { authApi } from '../api/authApi';
import { songsApi } from '../api/songsApi';
import { albumsApi } from '../api/albumsApi';
import { playlistsApi } from '../api/playlistsApi';
import { usersApi } from '../api/usersApi';
import { commentsApi } from '../api/commentsApi';
import { notificationsApi } from '../api/notificationsApi';
import { adminApi } from '../api/adminApi';
import { historyApi } from '../api/historyApi';
import { chartsApi } from '../api/chartsApi';
import { externalApi } from '../api/externalApi';

const store = configureStore({
  reducer: {
    auth: authReducer,
    player: playerReducer,
    [authApi.reducerPath]: authApi.reducer,
    [songsApi.reducerPath]: songsApi.reducer,
    [albumsApi.reducerPath]: albumsApi.reducer,
    [playlistsApi.reducerPath]: playlistsApi.reducer,
    [usersApi.reducerPath]: usersApi.reducer,
    [commentsApi.reducerPath]: commentsApi.reducer,
    [notificationsApi.reducerPath]: notificationsApi.reducer,
    [adminApi.reducerPath]: adminApi.reducer,
    [historyApi.reducerPath]: historyApi.reducer,
    [chartsApi.reducerPath]: chartsApi.reducer,
    [externalApi.reducerPath]: externalApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      songsApi.middleware,
      albumsApi.middleware,
      playlistsApi.middleware,
      usersApi.middleware,
      commentsApi.middleware,
      notificationsApi.middleware,
      adminApi.middleware,
      historyApi.middleware,
      chartsApi.middleware,
      externalApi.middleware
    ),
});

setupListeners(store.dispatch);

export default store;
