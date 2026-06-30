import { createApi } from '@reduxjs/toolkit/query/react';
import { reauthBaseQuery } from './baseQuery';

export const adminApi = createApi({
  reducerPath: 'adminApi',
  baseQuery: reauthBaseQuery,
  tagTypes: ['AdminStats', 'AdminUsers', 'AdminSongs'],
  endpoints: (builder) => ({
    getStats: builder.query({
      query: () => '/admin/stats',
      providesTags: ['AdminStats'],
    }),
    getUsers: builder.query({
      query: (params) => ({
        url: '/admin/users',
        params,
      }),
      providesTags: ['AdminUsers'],
    }),
    updateUserRole: builder.mutation({
      query: ({ id, role }) => ({
        url: `/admin/users/${id}/role`,
        method: 'PUT',
        body: { role },
      }),
      invalidatesTags: ['AdminUsers'],
    }),
    deleteUser: builder.mutation({
      query: (id) => ({
        url: `/admin/users/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['AdminUsers', 'AdminStats'],
    }),
    getAdminSongs: builder.query({
      query: (params) => ({
        url: '/admin/songs',
        params,
      }),
      providesTags: ['AdminSongs'],
    }),
    deleteSong: builder.mutation({
      query: (id) => ({
        url: `/admin/songs/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['AdminSongs', 'AdminStats'],
    }),
  }),
});

export const {
  useGetStatsQuery,
  useGetUsersQuery,
  useUpdateUserRoleMutation,
  useDeleteUserMutation,
  useGetAdminSongsQuery,
  useDeleteAdminSongMutation,
} = adminApi;
