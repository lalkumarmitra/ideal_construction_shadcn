import { PayloadAction, createSlice } from '@reduxjs/toolkit'


interface UserGeneratedDataStateInterface {
    favourities: number[],
}

const initialState: UserGeneratedDataStateInterface = {
    favourities: [],
}

const UserGeneratedDataSlice = createSlice({
    name: 'ugd',
    initialState,
    reducers: {
        addFavourities: (state, action: PayloadAction<number>) => {
            if (!state.favourities.includes(action.payload))
                state.favourities.push(action.payload)
        },
        removeFavourities: (state, action: PayloadAction<number>) => {
            const index = state.favourities.indexOf(action.payload);
            if (index !== -1) {
                state.favourities.splice(index, 1);
            }
        },
        setFavourities: (state, action: PayloadAction<number[]>) => {
            state.favourities = action.payload;
        },
    }
});

export const { addFavourities, removeFavourities, setFavourities } = UserGeneratedDataSlice.actions;
export default UserGeneratedDataSlice.reducer;
