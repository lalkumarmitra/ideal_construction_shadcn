import { configureStore } from '@reduxjs/toolkit'
import uiReducer from './Features/uiSlice'
import filterReducer from './Features/filterSlice'
import UserGeneratedDataReducer from './Features/userGeneratedDataSlice'

export const store = configureStore({
    reducer: {
        ui:uiReducer,
        ugd:UserGeneratedDataReducer,
        filters:filterReducer
    },
})
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch