import { createSlice } from '@reduxjs/toolkit'
import { HYDRATE } from 'next-redux-wrapper'

const initialState = {
    netState: false,
    nameNetwork:  "",
    networkId: "",
    account:"",
    balance:"",
}

export const networkSlice = createSlice({
    name: 'network',
    initialState,
    reducers: {
        setNetState(state, action) {
            state.netState = action.payload
        },
        setNameNetwork(state, action) {
            state.nameNetwork = action.payload
        },
        setNetworkId(state, action){
            state.networkId = action.payload  
        },
        setAccount(state, action){
            state.account = action.payload
        },
        setBalance(state, action){
            state.balance = action.payload
        },

        extraReducers: {
            // @ts-ignore
            [HYDRATE]: (state, action) => {
                return {
                    ...state,
                    ...action.payload.network,
                }
            },
        },
    },
})

export const { setNameNetwork, setNetState, setNetworkId, setAccount, setBalance } = networkSlice.actions
export const selectNetState = (state) => state.network.netState
export const selectNetworkId = (state) => state.network.networkId
export const selectNameNetwork = (state) => state.network.nameNetwork
export const selectAccount = (state) => state.network.account
export const selectBalance = (state) => state.network.balance
export default networkSlice.reducer