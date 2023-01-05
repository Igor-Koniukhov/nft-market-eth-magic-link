
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {HYDRATE} from "next-redux-wrapper";

const initialState = {
    isNetwork: false,
    networkName: "",
    networkId: "",
}


export const networkSlice = createSlice({
    name: 'network',
    initialState,
    reducers: {
        setIsNetwork(state, action) {
            state.isNetwork = action.payload ;
        },
        setNetworkName(state , action) {
            state.networkName = action.payload;
        },
        setNetworkId(state, action) {
            state.networkId = action.payload;
        },
        extraReducers: {

            [HYDRATE]: (state , action) => {
                return {
                    ...state,
                    ...action.payload.network,
                };
            },
        },
    },

});


export const {setIsNetwork, setNetworkName, setNetworkId} = networkSlice.actions;
export const selectIsNetwork = (state) => state.network.isNetwork;
export const selectNetworkName = (state) => state.network.networkName;
export const selectNetworkId = (state) => state.network.networkId;
export default networkSlice.reducer;