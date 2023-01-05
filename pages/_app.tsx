import "../styles/globals.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import React from "react";
import {Web3Provider} from "@providers";
import {wrapper} from "../store/store";
import {ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {Provider} from "react-redux";


function MyApp({Component, ...rest}) {
    console.log(wrapper)
    let {store, props} = wrapper.useWrappedStore(rest)
    const {pageProps} = props;

    return (
        <React.Fragment>
            <ToastContainer/>
            <Provider store={store}>
            <Web3Provider>
                    <Component {...pageProps} />
            </Web3Provider>
            </Provider>

        </React.Fragment>
    );
}

export default MyApp;
