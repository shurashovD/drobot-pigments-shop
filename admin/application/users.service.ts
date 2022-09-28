import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { createApi } from '@reduxjs/toolkit/query/react';
import { IClient, IPromocodeDoc } from '../../shared';

const usersApi = createApi({
	baseQuery: fetchBaseQuery({ baseUrl: "/api/users" }),
	endpoints: (build) => ({
		getUsers: build.query<{ clients: IClient[]; length: number }, { page?: number; limit?: number; status?: string }>({
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
		}),
		changeUserStatus: build.mutation<undefined, { id: string; status: string }>({
			query: ({ id, status }) => ({
				body: { status },
				method: "PUT",
				url: `/${id}`,
			}),
			invalidatesTags: ["users"],
		}),
	}),
	reducerPath: "userApi",
	tagTypes: ["users"],
})

export const { useGetUsersQuery, useGetClientQuery, useChangeUserStatusMutation } = usersApi
export default usersApi