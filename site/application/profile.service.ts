import { IPromocodeDetails, IPromocodeDoc } from './../../shared/index.d';
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { INearestOrder, IOrderPop, ISdekOrderInfo } from "../../shared";

const profileApi = createApi({
	baseQuery: fetchBaseQuery({ baseUrl: "/api/profile" }),
	endpoints: (build) => ({
		profileEdit: build.mutation<undefined, { name: string; email: string }>({
			query: (body) => ({
				body,
				method: "PUT",
				url: "/edit",
			}),
		}),
		getOrder: build.query<IOrderPop, string>({
			query: (id: string) => `/order/${id}`,
		}),
		getNearestOrder: build.query<undefined | INearestOrder, undefined>({
			query: () => "/order/nearest",
		}),
		getSdekInfo: build.query<ISdekOrderInfo["entity"], string>({
			query: (id: string) => `/order/sdek-info/${id}`,
		}),
		getDiscount: build.query<{ discountPercentValue?: string; nextLevelRequires: string[] }, undefined>({
			query: () => "/discount",
		}),
		getPromocodes: build.query<IPromocodeDoc[], void>({
			query: () => "/promocode",
			providesTags: () => ["promocodes"],
		}),
		getPromocodeDetails: build.query<IPromocodeDetails, { id: string }>({
			query: ({ id }) => `/promocode/orders/${id}`,
		}),
		createPromocode: build.mutation<undefined, { body: { dateStart: string; dateFinish: string; code: string } }>({
			query: ({ body }) => ({
				body,
				method: "POST",
				url: "/promocode",
			}),
			invalidatesTags: ["promocodes"],
		}),
		updatePromocode: build.mutation<undefined, { body: { dateStart: string; dateFinish: string; code: string }; id: string }>({
			query: ({ body, id }) => ({
				body,
				method: "PUT",
				url: `/promocode/${id}`,
			}),
			invalidatesTags: ["promocodes"],
		}),
		deletePromocode: build.mutation<undefined, { id: string }>({
			query: ({ id }) => ({
				method: "DELETE",
				url: `/promocode/${id}`,
			}),
			invalidatesTags: ["promocodes"],
		}),
		casheOutput: build.mutation<undefined, { casheSize: number }>({
			query: (body) => ({
				body,
				method: "POST",
				url: "/cashe-output",
			}),
		}),
	}),
	keepUnusedDataFor: 30,
	reducerPath: "profileApi",
	tagTypes: ["promocodes"],
})

export const {
	useProfileEditMutation,
	useGetNearestOrderQuery,
	useGetOrderQuery,
	useGetSdekInfoQuery,
	useGetDiscountQuery,
	useGetPromocodesQuery,
	useGetPromocodeDetailsQuery,
	useCreatePromocodeMutation,
	useUpdatePromocodeMutation,
	useDeletePromocodeMutation,
	useCasheOutputMutation,
} = profileApi
export default profileApi