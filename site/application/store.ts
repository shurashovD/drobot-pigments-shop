import { configureStore } from "@reduxjs/toolkit";
import alertSlice from "./alertSlice";
import cartSlice from "./cartSlice";
import categoriesSlice from "./categoriesSlice";
import categoryApi from "./category.service";
import { rtkQueryLogger } from "./error.middleware";
import fileApi from "./file.service";
import filtersSlice from "./filtersSlice";
import navCatalogSlice from "./navCatalogSlice";
import orderApi from "./order.service";
import productApi from "./product.service";

const store = configureStore({
	middleware: (getDefaultMiddleware) => [
		...getDefaultMiddleware(),
        categoryApi.middleware,
		fileApi.middleware,
        orderApi.middleware,
        productApi.middleware,
		rtkQueryLogger
	],
	reducer: {
		[alertSlice.name]: alertSlice.reducer,
		[categoryApi.reducerPath]: categoryApi.reducer,
		[categoriesSlice.name]: categoriesSlice.reducer,
		[cartSlice.name]: cartSlice.reducer,
		[fileApi.reducerPath]: fileApi.reducer,
		[filtersSlice.name]: filtersSlice.reducer,
		[navCatalogSlice.name]: navCatalogSlice.reducer,
        [orderApi.reducerPath]: orderApi.reducer,
        [productApi.reducerPath]: productApi.reducer,
	},
})

export default store

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch