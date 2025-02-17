import { createSlice, PayloadAction } from '@reduxjs/toolkit'


export type FilterType = {
    product_ids?: (string|number)[] | undefined;
    loading_vehicle_ids?: (string|number)[] | undefined;
    loading_date_from?: string | undefined;
    loading_date_to?: string | undefined;
    unloading_date_from?: string | undefined;
    unloading_date_to?: string | undefined;
    loading_client_sizes?: (string|number)[] | undefined;
    unloading_client_sizes?: (string|number)[] | undefined;
    loading_point_ids?: (string|number)[] | undefined;
    unloading_point_ids?: (string|number)[] | undefined;
}

type InitialStateType = {
    filterData : FilterType | undefined
}

const initialState: InitialStateType = {
    filterData: undefined,
}

export const filterSlice = createSlice({
    name: 'FilterData',
    initialState,
    reducers: {
        setFilterData: (state, action: PayloadAction<FilterType | undefined>) => ({ ...state, filterData: action.payload }),
        resetFilterData: (state) => ({ ...state, filterData: undefined })
    },
})

export const { setFilterData,resetFilterData } = filterSlice.actions
export default filterSlice.reducer