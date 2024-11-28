"use client"

//import type { Metadata } from "next";
import "./globals.css";
import { Inter } from 'next/font/google';
import { Provider } from "react-redux";
import { store } from "@/store/store";
import Script from 'next/script'; 

const inter = Inter({ subsets: ['latin'] });
import NextTopLoader from 'nextjs-toploader'
/*export const metadata: Metadata = {
  title: 'StudentHub - Your Learning Journey Starts Here',
  description: 'Join StudentHub to start your educational journey with the best resources and support.',
};*/

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Provider store={store}>
      
    <html lang="en">
      
      <body className={inter.className}>
        <NextTopLoader showSpinner={false} />

        {children} 

        <Script
          src="https://maps.googleapis.com/maps/api/js?key=AIzaSyBSM8o4WSIIRn-sNhn-PvO2s0ovZuLDAaw&libraries=places" // Replace with your script URL
          strategy="lazyOnload" // Load the script after the page has loaded
          onLoad={() => {
            console.log('google places loaded');
         }}
        />

      <Script
          src="https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/en_US/appleid.auth.js" // Replace with your script URL
          strategy="lazyOnload" // Load the script after the page has loaded
          onLoad={() => {
            console.log('google places loaded');
         }}
        />

      <Script strategy="lazyOnload" src="https://www.google.com/recaptcha/api.js?render=6Lei9R4pAAAAAEJYoXxoIvP2Uu0oq8iXkCVfmy6V"></Script>
{/*
      <Script strategy="lazyOnload" src="https://www.googletagmanager.com/gtag/js?id=G-Q2JP5Y7ZNF"></Script>

      <Script strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
          (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
        'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
        })(window,document,'script','dataLayer','GTM-5ZHJ48KV');
        `,
          }}
        />
        
      <Script strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-Q2JP5Y7ZNF');
             `,
          }}
        />


      <Script strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
        (function(h,o,t,j,a,r){
            h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
            h._hjSettings={hjid:4968508,hjsv:6};
            a=o.getElementsByTagName('head')[0];
            r=o.createElement('script');r.async=1;
            r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
            a.appendChild(r);
        })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
       `,
          }}
        />
*/}

      </body>
    </html>
    </Provider>
  );
}
