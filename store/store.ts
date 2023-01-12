import {configureStore} from '@reduxjs/toolkit'
import {createWrapper} from 'next-redux-wrapper'
import {networkSlice} from './slices/networkSlice'
import {authSlice} from "./slices/authSlice"


const makeStore = () =>
    configureStore({
        reducer: {
            [authSlice.name]: authSlice.reducer,
            [networkSlice.name]: networkSlice.reducer,
        },
        devTools: true,
    })

export const wrapper = createWrapper(makeStore)