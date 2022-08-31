import { isRejectedWithValue, Middleware, MiddlewareAPI } from "@reduxjs/toolkit"
import { errorAlert, setRedirectUrl } from "./alertSlice"

export const rtkQueryLogger: Middleware = (api: MiddlewareAPI) => (next) => (action) => {
    const { dispatch } = api
    if (action.meta?.baseQueryMeta?.response.redirected) {
        const url = new URL(action.meta?.baseQueryMeta?.response.url)
        dispatch(setRedirectUrl(url.pathname))
    }
    if (isRejectedWithValue(action)) {
        if (action.payload.data?.message) {
            dispatch(errorAlert(action.payload.data.message))
        }
    }
    return next(action)
} 