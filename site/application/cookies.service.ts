import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const cookiesApi = createApi({
    baseQuery: fetchBaseQuery({ baseUrl: '/api/cookies' }),
    endpoints: builder => ({
        getCookies: builder.query<boolean, void>({
            query: () => '/'
        }),
        setCookies: builder.mutation<undefined, void>({
            query: () => ({
                method: 'POST',
                url: '/'
            })
        })
    }),
    reducerPath: 'cookiesApi'
})

export const { useGetCookiesQuery, useSetCookiesMutation } = cookiesApi

export default cookiesApi