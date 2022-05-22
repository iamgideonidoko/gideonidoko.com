/* eslint-disable @next/next/next-script-for-ga */
/* eslint-disable @next/next/no-css-tags */
/* eslint-disable @next/next/no-sync-scripts */
import Document, { Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
    render() {
        return (
            <Html lang="en">
                <Head>
                    <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
                    <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
                    <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
                    <link rel="manifest" href="/site.webmanifest" />
                    <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
                    <meta name="msapplication-TileColor" content="#da532c" />
                    <meta name="theme-color" content="#ffffff" />
                    <meta name="language" content="English" />
                    <meta name="revisit-after" content="1 days" />

                    <link rel="stylesheet" href="/assets/icon/neu.css" />
                </Head>
                <body>
                    <Main />
                    <NextScript />
                    <script src="/assets/js/scrambling-text.js"></script>

                    {/*
          Firebase App (the core Firebase SDK) is always required and must be listed first
        */}

                    <script src="/assets/js/firebase-app.js"></script>

                    {/*
          Firebase Cloud Storage SDK
        */}
                    <script src="/assets/js/firebase-storage.js"></script>
                    {/*
          
          <!-- If you enabled Analytics in your project, add the Firebase SDK for Analytics -->
          <script src="https://www.gstatic.com/firebasejs/8.2.8/firebase-analytics.js"></script>
          <!-- Add Firebase products that you want to use -->
          <script src="https://www.gstatic.com/firebasejs/8.2.8/firebase-auth.js"></script>
          <script src="https://www.gstatic.com/firebasejs/8.2.8/firebase-firestore.js"></script>
          
        */}

                    {/* <!-- Global site tag (gtag.js) - Google Analytics --> */}
                    <script async src="https://www.googletagmanager.com/gtag/js?id=G-QJ2RYXMK6E"></script>
                </body>
            </Html>
        );
    }
}

export default MyDocument;
