import {configureStore} from "@reduxjs/toolkit";
import {createWrapper} from "next-redux-wrapper";
import {networkSlice} from "./slice/networkSlice";


const makeStore = () => {
    configureStore({
        reducer: {
            [networkSlice.name]: networkSlice.reducer,
        },
        devTools: true,
    })
}

export const wrapper = createWrapper(makeStore, {debug: true})