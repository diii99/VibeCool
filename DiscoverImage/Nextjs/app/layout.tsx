import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css"; // Assuming global styles including Tailwind are here

export const metadata: Metadata = {
  title: "Discover Your Image | Interactive Image Explorer",
  description: "Upload and reveal any image through interactive exploration, a creative way to gradually unveil pictures with your cursor. | Vibe coding in action: AI-generated website deployed via Yourware.",
  keywords: "Image Discovery Interactive Reveal Upload D3 Canvas SVG Image Explorer Interactive Art",
  // Open Graph meta tags from the original HTML
  openGraph: {
    title: "Discover Your Image | Interactive Image Explorer",
    description: "Upload and reveal any image through interactive exploration, a creative way to gradually unveil pictures with your cursor.",
    images: [{ url: "/OG-image.png" }], // Assuming OG-image.png will be in public folder
    url: "", // Update with actual URL if available
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge,chrome=IE8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="google" content="notranslate" />
        <link rel="icon" href="/favicon_new.png" type="image/png" />
        <link rel="shortcut icon" href="/favicon_new.png" type="image/png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500&family=Playfair+Display:ital,wght@0,400;0,500;1,400&display=swap" rel="stylesheet" />
        <link href="/koala.css" rel="stylesheet" type="text/css" />
        {/* Inline styles from original HTML - consider moving to koala.css or a global CSS file */}
        <style jsx global>{`
          #dots-container, #dots, #dots svg, #dots circle {
            touch-action: none !important;
            -ms-touch-action: none !important;
            -webkit-touch-callout: none !important;
            -webkit-user-select: none !important;
            -khtml-user-select: none !important;
            -moz-user-select: none !important;
            -ms-user-select: none !important;
            user-select: none !important;
          }
          #download-image, #share-twitter, #share-facebook, #share-instagram, #try-again, #shuffle-button {
            cursor: pointer !important;
            touch-action: manipulation !important;
            -webkit-tap-highlight-color: rgba(0,0,0,0) !important;
          }
        `}</style>
      </head>
      <body>
        {children}
        <Script src="/polyfill/polyfill.js" strategy="beforeInteractive" />
        <Script src="/polyfill/Blob.js" strategy="beforeInteractive" />
        <Script src="/polyfill/FileSaver.js" strategy="beforeInteractive" />
        <Script src="/d3.min.js" strategy="beforeInteractive" />
        <Script src="/koala.js" strategy="lazyOnload" />

        {/* Google Analytics */}
        <Script strategy="lazyOnload">
          {`
            var _gaq = _gaq || [];
            _gaq.push(['_setAccount', 'UA-17409200-2']);
            _gaq.push(['_trackPageview']);

            (function() {
              var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
              ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
              var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
            })();
          `}
        </Script>

        {/* FastTrack */}
        <Script strategy="lazyOnload">
          {`
            var _fastrack_account = 'FT-1000001';
            (function(w,h) {
              if (typeof _fastrack_account !== 'string') return;
              var acc = _fastrack_account;
              try {
                var session = 'S' + Math.random().toFixed(8).substring(2);
                var num = 0;
                var now = new Date();
                var initTime = +now;
                var tzm = String(now).match(/\((\w+)\)/);
                var sx = (window.pageXOffset !== undefined) ? window.pageXOffset : (document.documentElement || document.body.parentNode || document.body).scrollLeft;
                var sy = (window.pageYOffset !== undefined) ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop;
                w.fastrack = function(opt) {
                  var a = {
                    A: acc,
                    S: session,
                    N: num++,
                    P: document.location.href,
                    L: +new Date() - initTime,
                    F: w.document.referrer || 'Direct',
                    C: screen.width + 'x' + screen.height,
                    R: sx + 'x' + sy,
                    O: now.getTimezoneOffset(),
                    Z: (tzm && tzm.length === 2) ? tzm[1] : 'N/A'
                  }
                  if (opt) {
                    var s;
                    for (var j = 1; j <= 6; j++) {
                      s = 'D0' + j;
                      if (opt[s]) { a['D0' + j] = opt['D0' + j]; }
                      s = 'M0' + j;
                      if (opt[s]) { a['M0' + j] = opt['M0' + j]; }
                    }
                  }
                  if ('innerWidth' in window) {
                    a.W = w.innerWidth + 'x' + w.innerHeight;
                  } else {
                    var e = w.document.documentElement || w.document.body;
                    a.W = w.clientWidth + 'x' + w.clientHeight;
                  }
                  var params = [];
                  for (var k in a) params.push(encodeURIComponent(k) + "=" + encodeURIComponent(String(a[k])));
                  var i = new Image();
                  i.src = h + '?' + params.join('&');
                  return true;
                };
              }catch(e){}
            })(window,"https://rt.metamarkets.com/i1/m.gif");
          `}
        </Script>
      </body>
    </html>
  );
}
