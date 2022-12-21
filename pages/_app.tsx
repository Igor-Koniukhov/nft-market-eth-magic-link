import "../styles/globals.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import React from "react";
import { Web3Provider} from "@providers";



import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
