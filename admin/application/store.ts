import { configureStore } from "@reduxjs/toolkit";
import alertSlice from "./alertSlice";
import bindLabelModalSlice from "./bindLabelModalSlice";
import categoryApi from "./category.service";
import { rtkQueryLogger } from "./error.middleware";
import filtersSlice from "./filtersSlice";
import moySkladApi from "./moySklad.service";
import orderApi from "./order.service";
import ordersSlice from "./ordersSlice";
import productApi from "./product.service";

const store = configureStore({
	middleware: (getDefaultMiddleware) => [
		...getDefaultMiddleware(),
        categoryApi.middleware,
		moySkladApi.middleware,
        orderApi.middleware,
        productApi.middleware,
		rtkQueryLogger,
	],
	reducer: {
		[alertSlice.name]: alertSlice.reducer,
		[bindLabelModalSlice.name]: bindLabelModalSlice.reducer,
		[categoryApi.reducerPath]: categoryApi.reducer,
		[filtersSlice.name]: filtersSlice.reducer,
		[moySkladApi.reducerPath]: moySkladApi.reducer,
        [orderApi.reducerPath]: orderApi.reducer,
		[ordersSlice.name]: ordersSlice.reducer,
        [productApi.reducerPath]: productApi.reducer,
	},
})

export default store

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch