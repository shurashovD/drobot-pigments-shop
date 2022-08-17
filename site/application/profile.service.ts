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
	}),
	keepUnusedDataFor: 30,
	reducerPath: "profileApi",
})

export const {
	useProfileEditMutation,
	useGetNearestOrderQuery,
	useGetOrderQuery,
	useGetSdekInfoQuery,
	useGetDiscountQuery,
} = profileApi
export default profileApi