import type { AppProps } from "next/app"
import { Toaster } from "react-hot-toast"
import "../styles/globals.css"
import "../styles/test.css";


function MyApp({ Component, pageProps }: AppProps) {
    return (
        <>
            <Component {...pageProps} />
            <Toaster position="top-right" reverseOrder={false} />
        </>
    )
}

export default MyApp
