import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { reauthBaseQuery } from './baseQuery';
import { authApi } from './authApi';

export const songsApi = createApi({
  reducerPath: 'songsApi',
  baseQuery: reauthBaseQuery,
  tagTypes: ['Song', 'Songs'],
  endpoints: (builder) => ({
    getSongs: builder.query({
      query: (params) => ({
        url: '/songs',
        params,
      }),
      providesTags: ['Songs'],
    }),
    getSong: builder.query({
      query: (id) => `/songs/${id}`,
      providesTags: (result, error, id) => [{ type: 'Song', id }],
    }),
    uploadSong: builder.mutation({
      query: (formData) => ({
        url: '/songs',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['Songs'],
    }),
    updateSong: builder.mutation({
      query: ({ id, data }) => ({
        url: `/songs/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Song', id },
        'Songs',
      ],
    }),
    deleteSong: builder.mutation({
      query: (id) => ({
        url: `/songs/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Songs'],
    }),
    searchSongs: builder.query({
      query: (params) => ({
        url: '/songs/search',
        params,
      }),
      providesTags: ['Songs'],
    }),
    likeSong: builder.mutation({
      query: (id) => ({
        url: `/songs/${id}/like`,
        method: 'POST',
      }),
      invalidatesTags: ['Songs', 'User'],
    }),
    playSong: builder.mutation({
      query: (id) => ({
        url: `/songs/${id}/play`,
        method: 'POST',
      }),
    }),
  }),
});

export const {
  useGetSongsQuery,
  useGetSongQuery,
  useUploadSongMutation,
  useUpdateSongMutation,
  useDeleteSongMutation,
  useSearchSongsQuery,
  useLikeSongMutation,
  usePlaySongMutation,
} = songsApi;
