import { createApi } from '@reduxjs/toolkit/query/react';
import { reauthBaseQuery } from './baseQuery';

export const usersApi = createApi({
  reducerPath: 'usersApi',
  baseQuery: reauthBaseQuery,
  tagTypes: ['User', 'UserProfile'],
  endpoints: (builder) => ({
    getUserProfile: builder.query({
      query: (id) => `/users/${id}`,
      providesTags: (result, error, id) => [{ type: 'UserProfile', id }],
    }),
    updateProfile: builder.mutation({
      query: (formData) => ({
        url: '/users/profile',
        method: 'PUT',
        body: formData,
      }),
      invalidatesTags: ['UserProfile', 'User'],
    }),
    followUser: builder.mutation({
      query: (id) => ({
        url: `/users/${id}/follow`,
        method: 'POST',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'UserProfile', id }],
    }),
    getUserSongs: builder.query({
      query: ({ id, ...params }) => ({
        url: `/users/${id}/songs`,
        params,
      }),
    }),
    getUserAlbums: builder.query({
      query: ({ id, ...params }) => ({
        url: `/users/${id}/albums`,
        params,
      }),
    }),
    getFeed: builder.query({
      query: (params) => ({
        url: '/users/feed',
        params,
      }),
    }),
  }),
});

export const {
  useGetUserProfileQuery,
  useUpdateProfileMutation,
  useFollowUserMutation,
  useGetUserSongsQuery,
  useGetUserAlbumsQuery,
  useGetFeedQuery,
} = usersApi;
