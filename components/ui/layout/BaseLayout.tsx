import React, { FunctionComponent } from "react";
import Navbar from "../navbar";
import {useFiatOnRamp} from "@hooks/web3";
import LoginContent from "./LoginContent"
import Footer from "../footer/Footer";




interface Props {
  children: React.ReactNode;
}


const BaseLayout: FunctionComponent<Props> = ({ children }) => {
  const {magicWallet} = useFiatOnRamp();
  return (
    <>
    <Navbar magicWallet={magicWallet}/>
    <div className="py-16 bg-gray-50 overflow-hidden min-h-screen">
      {magicWallet.isLogin ?
          <div className="max-w-7xl mx-auto px-4 space-y-8 sm:px-6 lg:px-8">{children}</div> :
          <>
            <LoginContent/>
          </>      }

    </div>
      <Footer/>
    </>
    
  );
};

export default BaseLayout;
