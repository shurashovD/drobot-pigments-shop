import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { Product } from '../../shared'

const productApi = createApi({
	baseQuery: fetchBaseQuery({ baseUrl: "/api/products" }),
	endpoints: (build) => ({
		getProductById: build.query<Product, string>({
			query: (id) => `/${id}`,
			providesTags: () => ["product"],
		}),
		setProductPhoto: build.mutation<undefined, { id: string; body: FormData }>({
			query: ({ body, id }) => ({
				body,
				method: "PUT",
				url: `/photo/${id}`,
			}),
			invalidatesTags: ["product"],
		}),
		rmProductPhoto: build.mutation<undefined, string>({
			query: (id) => ({
				method: "DELETE",
				url: `/photo/${id}`,
			}),
			invalidatesTags: ["product"],
		}),
		setPhotoOrder: build.mutation<undefined, { productId: string; body: { photo: string[]; variantId?: string } }>({
			query: ({ body, productId }) => ({
				body,
				method: "PUT",
				url: `/set-photo-order/${productId}`,
			}),
			invalidatesTags: ["product"],
		}),
		setProductDescription: build.mutation<undefined, { id: string; body: { description: string } }>({
			query: ({ body, id }) => ({
				body,
				method: "PUT",
				url: `/description/${id}`,
			}),
			invalidatesTags: ["product"],
		}),
		addWorksPhoto: build.mutation<undefined, { id: string; body: FormData }>({
			query: ({ body, id }) => ({
				body,
				method: "POST",
				url: `/works-photo/${id}`,
			}),
			invalidatesTags: ["product"],
		}),
		addWorksVideo: build.mutation<undefined, { id: string; body: { url: string } }>({
			query: ({ body, id }) => ({
				body,
				method: "POST",
				url: `/works-video/${id}`,
			}),
			invalidatesTags: ["product"],
		}),
		rmWorksPhoto: build.mutation<undefined, { id: string; body: { photo: string } }>({
			query: ({ body, id }) => ({
				body,
				method: "DELETE",
				url: `/works-photo/${id}`,
			}),
			invalidatesTags: ["product"],
		}),
		rmWorksVideo: build.mutation<undefined, { id: string; body: { video: string } }>({
			query: ({ body, id }) => ({
				body,
				method: "DELETE",
				url: `/works-video/${id}`,
			}),
			invalidatesTags: ["product"],
		}),
		worksPhotosOrder: build.mutation<undefined, { id: string; body: { photos: string[] } }>({
			query: ({ body, id }) => ({
				body,
				method: "PUT",
				url: `/works-photos-order/${id}`,
			}),
			invalidatesTags: ["product"],
		}),
		worksVideosOrder: build.mutation<undefined, { id: string; body: { videos: string[] } }>({
			query: ({ body, id }) => ({
				body,
				method: "PUT",
				url: `/works-videos-order/${id}`,
			}),
			invalidatesTags: ["product"],
		}),
		setProductFilter: build.mutation<undefined, { id: string; body: { fieldId: string } }>({
			query: ({ body, id }) => ({
				body,
				method: "PUT",
				url: `/filter/${id}`,
			}),
			invalidatesTags: ["product"],
		}),
		resetProductFilter: build.mutation<undefined, { id: string; body: { fieldId: string } }>({
			query: ({ body, id }) => ({
				body,
				method: "DELETE",
				url: `/filter/${id}`,
			}),
			invalidatesTags: ["product"],
		}),
	}),
	reducerPath: "productApi",
	tagTypes: ["product"],
})

export const {
	useAddWorksPhotoMutation,
	useAddWorksVideoMutation,
	useRmWorksPhotoMutation,
	useRmWorksVideoMutation,
	useWorksPhotosOrderMutation,
	useWorksVideosOrderMutation,
	useGetProductByIdQuery, 
	useSetProductPhotoMutation,
	useRmProductPhotoMutation,
	useSetPhotoOrderMutation,
	useSetProductDescriptionMutation,
	useSetProductFilterMutation,
	useResetProductFilterMutation,
} = productApi

export default productApi