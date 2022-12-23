import { ICategoryContent } from '../../shared';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const categoryContentApi = createApi({
	baseQuery: fetchBaseQuery({ baseUrl: "/api/category-content" }),
	endpoints: (build) => ({
		getCategoryContent: build.query<ICategoryContent, { categoryId: string }>({
			query: ({ categoryId }) => `/${categoryId}`,
			providesTags: () => ["content"],
		}),
		createCategoryContent: build.mutation<undefined, { categoryId: string }>({
			query: ({ categoryId }) => ({
				method: "POST",
				url: `/${categoryId}`,
			}),
			invalidatesTags: ["content"],
		}),
		addCarouselSlide: build.mutation<undefined, { body: FormData; contentId: string }>({
			query: ({ body, contentId }) => ({
				body,
				method: "POST",
				url: `/add-carousel-image/${contentId}`,
			}),
			invalidatesTags: ["content"],
		}),
		setVideoUrl: build.mutation<undefined, { body: { url: string }; contentId: string }>({
			query: ({ body, contentId }) => ({
				body,
				method: "POST",
				url: `/set-video-url/${contentId}`,
			}),
			invalidatesTags: ["content"],
		}),
		addSideBarLink: build.mutation<undefined, { body: { text: string; href?: string; to?: string }; contentId: string }>({
			query: ({ body, contentId }) => ({
				body,
				method: "POST",
				url: `/add-sidebarlink/${contentId}`,
			}),
			invalidatesTags: ["content"],
		}),
		updSlideInfo: build.mutation<undefined, { body: { imageId: string; href?: string; to?: string }; contentId: string }>({
			query: ({ body, contentId }) => ({
				body,
				method: "PUT",
				url: `/update-slide-info/${contentId}`,
			}),
			invalidatesTags: ["content"],
		}),
		updSidebarLink: build.mutation<undefined, { body: { linkId: string; text?: string; href?: string; to?: string }; contentId: string }>({
			query: ({ body, contentId }) => ({
				body,
				method: "PUT",
				url: `/update-sidebarlink/${contentId}`,
			}),
			invalidatesTags: ["content"],
		}),
		sortCarousel: build.mutation<undefined, { body: { order: string[] }; contentId: string }>({
			query: ({ body, contentId }) => ({
				body,
				method: "PUT",
				url: `/sort-carousel/${contentId}`,
			}),
			invalidatesTags: ["content"],
		}),
		sortSidebar: build.mutation<undefined, { body: { order: string[] }; contentId: string }>({
			query: ({ body, contentId }) => ({
				body,
				method: "PUT",
				url: `/sort-sidebar/${contentId}`,
			}),
			invalidatesTags: ["content"],
		}),
		rmCarouselSlide: build.mutation<undefined, { body: { imageId: string }; contentId: string }>({
			query: ({ body, contentId }) => ({
				body,
				method: "DELETE",
				url: `/slide/${contentId}`,
			}),
			invalidatesTags: ["content"],
		}),
		rmSidebarLink: build.mutation<undefined, { body: { linkId: string }; contentId: string }>({
			query: ({ body, contentId }) => ({
				body,
				method: "DELETE",
				url: `/sidebar-link/${contentId}`,
			}),
			invalidatesTags: ["content"],
		}),
		rmVideo: build.mutation<undefined, { body: { url: string }; contentId: string }>({
			query: ({ body, contentId }) => ({
				body,
				method: "DELETE",
				url: `/video/${contentId}`,
			}),
			invalidatesTags: ["content"],
		}),
	}),
	reducerPath: "categoryContentApi",
	tagTypes: ["content"],
})

export const {
    useAddCarouselSlideMutation,
    useAddSideBarLinkMutation,
    useCreateCategoryContentMutation,
    useGetCategoryContentQuery,
    useRmCarouselSlideMutation,
    useRmSidebarLinkMutation,
    useRmVideoMutation,
    useSetVideoUrlMutation,
    useSortCarouselMutation,
    useSortSidebarMutation,
    useUpdSidebarLinkMutation,
    useUpdSlideInfoMutation
} = categoryContentApi
export default categoryContentApi