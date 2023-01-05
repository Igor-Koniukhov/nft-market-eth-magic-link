import "../styles/globals.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import React from "react";
import { Web3Provider} from "@providers";
import {wrapper} from "../store/store";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {Provider} from "react-redux";

// @ts-ignore
function MyApp({ Component, pageProps }: React.Component) {


    return (
    <React.Fragment>
        <ToastContainer/>
            <Web3Provider>

                <Component {...pageProps} />

            </Web3Provider>


    </React.Fragment>
  );
}

export default MyApp;
