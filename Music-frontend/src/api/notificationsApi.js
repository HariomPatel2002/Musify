import { createApi } from '@reduxjs/toolkit/query/react';
import { reauthBaseQuery } from './baseQuery';

export const notificationsApi = createApi({
  reducerPath: 'notificationsApi',
  baseQuery: reauthBaseQuery,
  tagTypes: ['Notifications'],
  endpoints: (builder) => ({
    getNotifications: builder.query({
      query: (params) => ({
        url: '/notifications',
        params,
      }),
      providesTags: ['Notifications'],
    }),
    markAllRead: builder.mutation({
      query: () => ({
        url: '/notifications/read',
        method: 'PUT',
      }),
      invalidatesTags: ['Notifications'],
    }),
    markOneRead: builder.mutation({
      query: (id) => ({
        url: `/notifications/${id}/read`,
        method: 'PUT',
      }),
      invalidatesTags: ['Notifications'],
    }),
    deleteNotification: builder.mutation({
      query: (id) => ({
        url: `/notifications/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Notifications'],
    }),
  }),
});

export const {
  useGetNotificationsQuery,
  useMarkAllReadMutation,
  useMarkOneReadMutation,
  useDeleteNotificationMutation,
} = notificationsApi;
