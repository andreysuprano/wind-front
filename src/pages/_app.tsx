import { ChakraProvider } from "@chakra-ui/react";
import type { AppProps } from "next/app";
import AuthContextProvider from "../contexts/authContext";
import "../styles/globals.css";
import dynamic from "next/dynamic";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider>
      <AuthContextProvider>
        <Component {...pageProps} />
      </AuthContextProvider>
    </ChakraProvider>
  );
}

export default dynamic(() => Promise.resolve(MyApp), { ssr: false });
