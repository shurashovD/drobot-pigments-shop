import { configureStore } from "@reduxjs/toolkit";
import accountApi from "./account.service";
import alertSlice from "./alertSlice";
import authComponentSlice from "./authComponentSlice";
import categoriesSlice from "./categoriesSlice";
import categoryApi from "./category.service";
import cookiesApi from "./cookies.service";
import { rtkQueryLogger } from "./error.middleware";
import errorApi from "./error.service";
import fileApi from "./file.service";
import filtersSlice from "./filtersSlice";
import navCatalogSlice from "./navCatalogSlice";
import orderApi from "./order.service";
import orderSlice from "./orderSlice";
import productApi from "./product.service";
import profileApi from "./profile.service";
import profilePromocodesSlice from "./profilePromocodesSlice";
import profileSlice from "./profileSlice";

const store = configureStore({
	middleware: (getDefaultMiddleware) => [
		...getDefaultMiddleware(),
		accountApi.middleware,
        categoryApi.middleware,
		cookiesApi.middleware,
		errorApi.middleware,
		fileApi.middleware,
        orderApi.middleware,
        productApi.middleware,
		profileApi.middleware,
		rtkQueryLogger
	],
	reducer: {
		[accountApi.reducerPath]: accountApi.reducer,
		[alertSlice.name]: alertSlice.reducer,
		[authComponentSlice.name]: authComponentSlice.reducer,
		[categoryApi.reducerPath]: categoryApi.reducer,
		[categoriesSlice.name]: categoriesSlice.reducer,
		[cookiesApi.reducerPath]: cookiesApi.reducer,
		[errorApi.reducerPath]: errorApi.reducer,
		[fileApi.reducerPath]: fileApi.reducer,
		[filtersSlice.name]: filtersSlice.reducer,
		[navCatalogSlice.name]: navCatalogSlice.reducer,
        [orderApi.reducerPath]: orderApi.reducer,
		[orderSlice.name]: orderSlice.reducer,
        [productApi.reducerPath]: productApi.reducer,
		[profileApi.reducerPath]: profileApi.reducer,
		[profilePromocodesSlice.name]: profilePromocodesSlice.reducer,
		[profileSlice.name]: profileSlice.reducer,
	},
})

export default store

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch