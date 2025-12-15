import type { AppProps } from "next/app";

// Re-use the same Tailwind/global stylesheet as the app router:
import "../src/app/globals.css";

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
