import { configureStore } from "@reduxjs/toolkit";
import alertSlice from "./alertSlice";
import categoryApi from "./category.service";
import { rtkQueryLogger } from "./error.middleware";
import filtersSlice from "./filtersSlice";
import moySkladApi from "./moySklad.service";
import orderApi from "./order.service";
import ordersSlice from "./ordersSlice";
import productApi from "./product.service";
import sdekApi from "./sdek.service";

const store = configureStore({
	middleware: (getDefaultMiddleware) => [
		...getDefaultMiddleware(),
        categoryApi.middleware,
		moySkladApi.middleware,
        orderApi.middleware,
        productApi.middleware,
		rtkQueryLogger,
		sdekApi.middleware,
	],
	reducer: {
		[alertSlice.name]: alertSlice.reducer,
		[categoryApi.reducerPath]: categoryApi.reducer,
		[filtersSlice.name]: filtersSlice.reducer,
		[moySkladApi.reducerPath]: moySkladApi.reducer,
        [orderApi.reducerPath]: orderApi.reducer,
		[ordersSlice.name]: ordersSlice.reducer,
        [productApi.reducerPath]: productApi.reducer,
		[sdekApi.reducerPath]: sdekApi.reducer,
	},
})

export default store

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch