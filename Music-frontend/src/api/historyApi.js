import { createApi } from '@reduxjs/toolkit/query/react';
import { reauthBaseQuery } from './baseQuery';

export const historyApi = createApi({
  reducerPath: 'historyApi',
  baseQuery: reauthBaseQuery,
  tagTypes: ['History'],
  endpoints: (builder) => ({
    getHistory: builder.query({
      query: () => '/history',
      providesTags: ['History'],
    }),
    clearHistory: builder.mutation({
      query: () => ({ url: '/history', method: 'DELETE' }),
      invalidatesTags: ['History'],
    }),
    removeFromHistory: builder.mutation({
      query: (songId) => ({ url: `/history/${songId}`, method: 'DELETE' }),
      invalidatesTags: ['History'],
    }),
  }),
});

export const { useGetHistoryQuery, useClearHistoryMutation, useRemoveFromHistoryMutation } = historyApi;
