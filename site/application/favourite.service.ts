import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/dist/query/react";
import { IFavourite } from "../../shared";

const favouriteApi = createApi({
	baseQuery: fetchBaseQuery({ baseUrl: "/api/favourite" }),
	endpoints: (build) => ({
		getFavourites: build.query<IFavourite, void>({
			query: () => "/",
			providesTags: () => ["favourites"],
		}),
		addFavourites: build.mutation<undefined, { productId: string; variantId?: string }>({
			query: (body) => ({
				body,
				method: "POST",
				url: "/",
			}),
			invalidatesTags: ["favourites"],
		}),
		rmFavourites: build.mutation<undefined, { productId: string; variantId?: string }>({
			query: (body) => ({
				body,
				method: "DELETE",
				url: "/",
			}),
			invalidatesTags: ["favourites"],
		}),
	}),
	tagTypes: ["favourites"],
})

export const { useAddFavouritesMutation, useGetFavouritesQuery, useRmFavouritesMutation } = favouriteApi

export default favouriteApi