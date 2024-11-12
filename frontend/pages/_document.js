import Document, { Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
            <link rel="icon" href="/images/favicon.png" />
            <link rel="stylesheet" href="/plugins/bootstrap/bootstrap.min.css" />
            <link rel="stylesheet" href="/css/font-awesome.css" />
            <link rel="stylesheet" href="/css/animate.min.css" />
            <link rel="stylesheet" href="/css/fontello.css" />
            <link rel="stylesheet" href="/plugins/accordion.css" />
            <link rel="stylesheet" href="/plugins/glightbox.min.css" />
            <link rel="stylesheet" href="/css/style.css" />
            <link rel="stylesheet" href="/css/responsive.css" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
