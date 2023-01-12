import React, {FunctionComponent} from "react"
import Navbar from "../navbar"
import LoginContent from "./LoginContent"
import Footer from "../footer/Footer"
import {useSelector} from "react-redux"
import {selectAuthState} from "../../../store/slices/authSlice"


interface Props {
    children: React.ReactNode
}

const BaseLayout: FunctionComponent<Props> = ({children}) => {
    const isLogin = useSelector(selectAuthState)
    return (
        <>
            <Navbar/>
            <div className="py-16 bg-gray-50 overflow-hidden min-h-screen">
                {isLogin ?
                    <div className="max-w-7xl mx-auto px-4 space-y-8 sm:px-6 lg:px-8">{children}</div> :
                    <>
                        <LoginContent/>
                    </>}

            </div>
            <Footer/>
        </>

    )
}

export default BaseLayout
