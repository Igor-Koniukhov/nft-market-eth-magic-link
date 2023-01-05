import { createSlice } from '@reduxjs/toolkit';
import { HYDRATE } from 'next-redux-wrapper';

const initialState = {
    netState: false,
    nameNetwork: "Goerli Test Network",
};

export const networkSlice = createSlice({
    name: 'network',
    initialState,
    reducers: {
        setNetState(state, action) {
            state.netState = action.payload;
        },
        setNameNetwork(state, action) {
            state.nameNetwork = action.payload;
        },

        extraReducers: {
            // @ts-ignore
            [HYDRATE]: (state, action) => {
                return {
                    ...state,
                    ...action.payload.network,
                };
            },
        },
    },
});

export const { setNameNetwork, setNetState } = networkSlice.actions;
export const selectNetState = (state) => state.network.netState;
export const selectNameNetwork = (state) => state.network.nameNetwork;
export default networkSlice.reducer;