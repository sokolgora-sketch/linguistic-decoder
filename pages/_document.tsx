import Document, { Html, Head, Main, NextScript } from "next/document";

// Explicit Document file to avoid Next build/runtime "Cannot find module for page: /_document".
export default class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head />
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
