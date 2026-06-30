import { createApi } from '@reduxjs/toolkit/query/react';
import { reauthBaseQuery } from './baseQuery';

export const commentsApi = createApi({
  reducerPath: 'commentsApi',
  baseQuery: reauthBaseQuery,
  tagTypes: ['Comments'],
  endpoints: (builder) => ({
    getComments: builder.query({
      query: ({ songId, ...params }) => ({
        url: `/songs/${songId}/comments`,
        params,
      }),
      providesTags: ['Comments'],
    }),
    addComment: builder.mutation({
      query: ({ songId, text }) => ({
        url: `/songs/${songId}/comments`,
        method: 'POST',
        body: { text },
      }),
      invalidatesTags: ['Comments'],
    }),
    updateComment: builder.mutation({
      query: ({ id, text }) => ({
        url: `/comments/${id}`,
        method: 'PUT',
        body: { text },
      }),
      invalidatesTags: ['Comments'],
    }),
    deleteComment: builder.mutation({
      query: (id) => ({
        url: `/comments/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Comments'],
    }),
    likeComment: builder.mutation({
      query: (id) => ({
        url: `/comments/${id}/like`,
        method: 'POST',
      }),
      invalidatesTags: ['Comments'],
    }),
  }),
});

export const {
  useGetCommentsQuery,
  useAddCommentMutation,
  useUpdateCommentMutation,
  useDeleteCommentMutation,
  useLikeCommentMutation,
} = commentsApi;
