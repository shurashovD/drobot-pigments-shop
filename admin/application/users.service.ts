import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { createApi } from '@reduxjs/toolkit/query/react';
import { ICashbackReport, IClient, IDebiteReport } from '../../shared';

const usersApi = createApi({
	baseQuery: fetchBaseQuery({ baseUrl: "/api/users" }),
	endpoints: (build) => ({
		getUsers: build.query<{ clients: (IClient & { promocode?: string })[]; length: number }, { page?: number; limit?: number; status?: string }>({
			query: ({ page = 0, limit, status }) => {
				let url = `?page=${page}`
				if (limit) {
					url += `&limit=${limit}`
				}
				if (status) {
					url += `&status=${status}`
				}
				return url
			},
			providesTags: () => ["users"],
		}),
		getClient: build.query<IClient, { id: string }>({
			query: ({ id }) => `/${id}`,
			providesTags: () => ["client"],
		}),
		changeUserStatus: build.mutation<undefined, { id: string; status: string }>({
			query: ({ id, status }) => ({
				body: { status },
				method: "PUT",
				url: `/${id}`,
			}),
			invalidatesTags: ["users"],
		}),
		debiteCashback: build.mutation<undefined, { clientId: string; body: { total: number } }>({
			query: ({ body, clientId }) => ({
				body,
				method: "PUT",
				url: `/debiting-cashback/${clientId}`,
			}),
			invalidatesTags: ["client"],
		}),
		getCashbackReport: build.query<ICashbackReport[], { id?: string }>({
			query: ({ id }) => `/cashback-report/${id}`,
		}),
		getDebitesReport: build.query<IDebiteReport, { id: string }>({
			query: ({ id }) => `/debites-report/${id}`,
		}),
		setPromocodeDiscount: build.mutation<undefined, { promocodeId: string; discountPercent: number }>({
			query: (body) => ({
				body,
				method: "PUT",
				url: "/set-promocode-discount",
			}),
			invalidatesTags: ['client']
		}),
	}),
	reducerPath: "userApi",
	tagTypes: ["users", "client"],
})

export const {
	useGetUsersQuery,
	useGetClientQuery,
	useChangeUserStatusMutation,
	useDebiteCashbackMutation,
	useGetCashbackReportQuery,
	useGetDebitesReportQuery,
	useSetPromocodeDiscountMutation,
} = usersApi
export default usersApi