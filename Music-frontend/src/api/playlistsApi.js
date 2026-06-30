import { createApi } from '@reduxjs/toolkit/query/react';
import { reauthBaseQuery } from './baseQuery';

export const playlistsApi = createApi({
  reducerPath: 'playlistsApi',
  baseQuery: reauthBaseQuery,
  tagTypes: ['Playlist', 'Playlists'],
  endpoints: (builder) => ({
    getPlaylists: builder.query({
      query: () => '/playlists',
      providesTags: ['Playlists'],
    }),
    getMyPlaylists: builder.query({
      query: () => '/playlists/mine',
      providesTags: ['Playlists'],
    }),
    getPlaylist: builder.query({
      query: (id) => `/playlists/${id}`,
      providesTags: (result, error, id) => [{ type: 'Playlist', id }],
    }),
    createPlaylist: builder.mutation({
      query: (body) => ({
        url: '/playlists',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Playlists'],
    }),
    updatePlaylist: builder.mutation({
      query: ({ id, data }) => ({
        url: `/playlists/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Playlist', id },
        'Playlists',
      ],
    }),
    deletePlaylist: builder.mutation({
      query: (id) => ({
        url: `/playlists/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Playlists'],
    }),
    addSongToPlaylist: builder.mutation({
      query: ({ id, songId }) => ({
        url: `/playlists/${id}/songs`,
        method: 'POST',
        body: { songId },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Playlist', id },
        'Playlists',
      ],
    }),
    removeSongFromPlaylist: builder.mutation({
      query: ({ id, songId }) => ({
        url: `/playlists/${id}/songs/${songId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Playlist', id },
        'Playlists',
      ],
    }),
  }),
});

export const {
  useGetPlaylistsQuery,
  useGetMyPlaylistsQuery,
  useGetPlaylistQuery,
  useCreatePlaylistMutation,
  useUpdatePlaylistMutation,
  useDeletePlaylistMutation,
  useAddSongToPlaylistMutation,
  useRemoveSongFromPlaylistMutation,
} = playlistsApi;
