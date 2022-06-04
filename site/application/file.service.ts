import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

const fileApi = createApi({
	baseQuery: fetchBaseQuery({ baseUrl: "" }),
	endpoints: (build) => ({
		upload: build.query<string, string>({
			query: (fileName) => ({
				url: `/file/${fileName}`,
				responseHandler: (res) =>
					res
						.blob()
						.then((blob) =>
							URL.createObjectURL(new File([blob], fileName))
						),
			}),
			providesTags: () => ["intro"],
		}),
		static: build.query<string, string>({
			query: (path) => ({
				url: `${path}`,
				responseHandler: (res) =>
					res
						.blob()
						.then((blob) =>
							URL.createObjectURL(
								new File([blob], path.split("/").pop() || "")
							)
						),
			}),
		}),
		load: build.mutation<string, string>({
			query: (path) => ({
				url: `/static?file=${path}`,
				responseHandler: (res) =>
					res
						.blob()
						.then((blob) =>
							URL.createObjectURL(
								new File([blob], path.split("/").pop() || "")
							)
						),
			}),
		}),
	}),
	reducerPath: "fileApi",
	tagTypes: ["intro"],
})

export const {
	useLazyStaticQuery,
	useLazyUploadQuery,
	useStaticQuery,
	useUploadQuery,
	useLoadMutation,
} = fileApi

export default fileApi