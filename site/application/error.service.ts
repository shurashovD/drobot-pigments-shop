import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
const errorApi = createApi({
	baseQuery: fetchBaseQuery({ baseUrl: "/api/front-handler" }),
    endpoints: build => ({
        sendError: build.mutation<undefined, { error: string, stack: string }>({
            query: (body) => ({
                body,
                method: 'POST',
                url: '/'
            })
        })
    }),
    reducerPath: 'errorApi'
})

export const { useSendErrorMutation } = errorApi
export default errorApi