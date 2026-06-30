import { createApi } from '@reduxjs/toolkit/query/react';
import { reauthBaseQuery } from './baseQuery';

export const albumsApi = createApi({
  reducerPath: 'albumsApi',
  baseQuery: reauthBaseQuery,
  tagTypes: ['Album', 'Albums'],
  endpoints: (builder) => ({
    getAlbums: builder.query({
      query: (params) => ({
        url: '/albums',
        params,
      }),
      providesTags: ['Albums'],
    }),
    getAlbum: builder.query({
      query: (id) => `/albums/${id}`,
      providesTags: (result, error, id) => [{ type: 'Album', id }],
    }),
    createAlbum: builder.mutation({
      query: (formData) => ({
        url: '/albums',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['Albums'],
    }),
    updateAlbum: builder.mutation({
      query: ({ id, data }) => ({
        url: `/albums/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Album', id },
        'Albums',
      ],
    }),
    deleteAlbum: builder.mutation({
      query: (id) => ({
        url: `/albums/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Albums'],
    }),
    addSongToAlbum: builder.mutation({
      query: ({ id, songId }) => ({
        url: `/albums/${id}/songs`,
        method: 'POST',
        body: { songId },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Album', id },
        'Albums',
      ],
    }),
    removeSongFromAlbum: builder.mutation({
      query: ({ id, songId }) => ({
        url: `/albums/${id}/songs/${songId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Album', id },
        'Albums',
      ],
    }),
  }),
});

export const {
  useGetAlbumsQuery,
  useGetAlbumQuery,
  useCreateAlbumMutation,
  useUpdateAlbumMutation,
  useDeleteAlbumMutation,
  useAddSongToAlbumMutation,
  useRemoveSongFromAlbumMutation,
} = albumsApi;
