import Document, {
  DocumentContext,
  Html,
  Head,
  Main,
  NextScript,
} from "next/document";
import Script from "next/script";
class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const initalProps = await Document.getInitialProps(ctx);

    return initalProps;
  }

  render() {
    return (
      <Html>
        <Head>
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
          />
        </Head>
        <body>
          <Script
            strategy="lazyOnload"
            type="text/javascript"
            src="https://maps.googleapis.com/maps/api/js?key=AIzaSyA6ZUaSv2WnL_BSqQEzvGoVrPkHAYRD2bw&language=es&libraries=places,distancematrix"
          ></Script>
          {/* conector plugin */}
          {/* <script src="../utils/conectorPlugin.js"></script> */}
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
