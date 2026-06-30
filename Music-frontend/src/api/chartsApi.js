import { createApi } from '@reduxjs/toolkit/query/react';
import { reauthBaseQuery } from './baseQuery';

export const chartsApi = createApi({
  reducerPath: 'chartsApi',
  baseQuery: reauthBaseQuery,
  tagTypes: ['Charts'],
  endpoints: (builder) => ({
    getCharts: builder.query({
      query: () => '/charts',
      providesTags: ['Charts'],
    }),
  }),
});

export const { useGetChartsQuery } = chartsApi;
