import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

const sdekApi = createApi({
	baseQuery: fetchBaseQuery({ baseUrl: "/api/sdek" }),
	endpoints: (build) => ({
		syncPoints: build.mutation({
			query: () => ({
                method: 'POST',
                url: "/update-pvz"
            }),
		}),
	}),
	reducerPath: "sdekApi",
})

export const { useSyncPointsMutation } = sdekApi

export default sdekApi