import { configureStore } from "@reduxjs/toolkit";
import alertSlice from "./alertSlice";
import amoApi from "./amo.service";
import categoryApi from "./category.service";
import { rtkQueryLogger } from "./error.middleware";
import filtersSlice from "./filtersSlice";
import loyaltyApi from "./loyalty.service";
import moySkladApi from "./moySklad.service";
import orderApi from "./order.service";
import ordersSlice from "./ordersSlice";
import productApi from "./product.service";
import promocodeApi from "./promocode.service";
import sdekApi from "./sdek.service";
import usersApi from "./users.service";

const store = configureStore({
	middleware: (getDefaultMiddleware) => [
		...getDefaultMiddleware(),
		amoApi.middleware,
		categoryApi.middleware,
		loyaltyApi.middleware,
		moySkladApi.middleware,
		orderApi.middleware,
		productApi.middleware,
		promocodeApi.middleware,
		rtkQueryLogger,
		sdekApi.middleware,
		usersApi.middleware,
	],
	reducer: {
		[alertSlice.name]: alertSlice.reducer,
		[amoApi.reducerPath]: amoApi.reducer,
		[categoryApi.reducerPath]: categoryApi.reducer,
		[filtersSlice.name]: filtersSlice.reducer,
		[loyaltyApi.reducerPath]: loyaltyApi.reducer,
		[moySkladApi.reducerPath]: moySkladApi.reducer,
		[orderApi.reducerPath]: orderApi.reducer,
		[ordersSlice.name]: ordersSlice.reducer,
		[productApi.reducerPath]: productApi.reducer,
		[promocodeApi.reducerPath]: promocodeApi.reducer,
		[sdekApi.reducerPath]: sdekApi.reducer,
		[usersApi.reducerPath]: usersApi.reducer,
	},
})

export default store

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch