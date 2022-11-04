import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { createApi } from '@reduxjs/toolkit/query/react';
import { Product } from '../../shared';

const ratingApi = createApi({
	baseQuery: fetchBaseQuery({ baseUrl: "/api/rating" }),
	endpoints: (build) => ({
		shouldRated: build.query<Product[], void>({
			query: () => "/should-rated",
			providesTags: () => ["products"],
		}),
		setRating: build.mutation<undefined, { productId: string; rating: number; variantId?: string; text?: string; deliveryRating?: number }>({
            query: (body) => ({
                body,
                method: 'POST',
                url: '/'
            }),
            invalidatesTags: ['products'],
        }),
	}),
	reducerPath: "ratingApi",
	tagTypes: ["products"],
})

export const { useSetRatingMutation, useShouldRatedQuery } = ratingApi
export default ratingApi