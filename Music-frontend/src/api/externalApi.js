import { createApi } from '@reduxjs/toolkit/query/react';
import { reauthBaseQuery } from './baseQuery';

export const externalApi = createApi({
  reducerPath: 'externalApi',
  baseQuery: reauthBaseQuery,
  endpoints: (builder) => ({
    searchItunes: builder.query({
      query: (params) => ({ url: '/external/search', params }),
    }),
  }),
});

export const { useSearchItunesQuery } = externalApi;
