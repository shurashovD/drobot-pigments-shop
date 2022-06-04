import { isRejectedWithValue, Middleware, MiddlewareAPI } from "@reduxjs/toolkit"
import { errorAlert } from "./alertSlice"

export const rtkQueryLogger: Middleware = (api: MiddlewareAPI) => (next) => (action) => {
    if (isRejectedWithValue(action)) {
        const { dispatch } = api
        dispatch(errorAlert(action.payload.data.message))
    }
    return next(action)
} 