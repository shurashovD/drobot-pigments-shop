import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { createApi } from '@reduxjs/toolkit/query/react';
import { IPromocode, IPromocodeDetails } from '../../shared';

const promocodeApi = createApi({
	baseQuery: fetchBaseQuery({ baseUrl: "/api/promocodes" }),
	endpoints: (build) => ({
		getPromocode: build.query<IPromocode, { id: string }>({
			query: ({ id }) => `/${id}`,
		}),
		getPromocodesByUser: build.query<IPromocodeDetails[], { clientId: string }>({
			query: ({ clientId }) => `/by-user/${clientId}`,
			providesTags: () => ["clientPromocodes"],
		}),
		getPromocodeDetails: build.query<IPromocodeDetails, { id: string }>({
			query: ({ id }) => `/details/${id}`,
		}),
		createPromocode: build.mutation<
			undefined,
			{ code: string; dateStart: string; dateFinish: string; holderId: string; discountPercent: number }
		>({
			query: (body) => ({
				body,
				method: "POST",
				url: "/",
			}),
			invalidatesTags: ["clientPromocodes"],
		}),
		updatePromocode: build.mutation<
			undefined,
			{ id: string; body: { code: string; dateStart: string; dateFinish: string; discountPercent: number } }
		>({
			query: ({ body, id }) => ({
				body,
				method: "PUT",
				url: `/${id}`,
			}),
			invalidatesTags: ["clientPromocodes"],
		}),
		deletePromocode: build.mutation<undefined, { id: string }>({
			query: ({ id }) => ({
				method: "DELETE",
				url: `/${id}`,
			}),
			invalidatesTags: ["clientPromocodes"],
		}),
	}),
	reducerPath: "promocodeApi",
	tagTypes: ["clientPromocodes"],
})

export const {
    useGetPromocodeQuery,
	useGetPromocodesByUserQuery,
	useGetPromocodeDetailsQuery,
    useCreatePromocodeMutation,
    useUpdatePromocodeMutation,
    useDeletePromocodeMutation,
} = promocodeApi

export default promocodeApi