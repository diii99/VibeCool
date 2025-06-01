"use client"; // Required for useEffect and event handlers

declare const d3: any; // Declare d3 to inform TypeScript about the global variable

import React, { useEffect } from 'react';
import Head from 'next/head'; 
import Script from 'next/script';
import Image from "next/image"; // Keep this if used, or remove if not

export default function HomePage() {
  useEffect(() => {
    // Initialize version (from original script tag)
    (window as any).version = '1.9.4';

    // Global functions and variables from the original index.html
    (window as any).fixShareButtons = function() {
      var buttonsToFix = [
        'download-image', 'share-twitter', 'share-facebook', 
        'share-instagram', 'try-again', 'shuffle-button'
      ];
      buttonsToFix.forEach(function(id: string) {
        var button = document.getElementById(id);
        if (!button) return;
        if ((button as any)._touchEndHandlerAdded) {
          return;
        }
        button.style.touchAction = 'manipulation';
        button.style.cursor = 'pointer';
        (button as any)._touchEndHandlerAdded = true;
        console.log('Button fixed (once): ' + id);
      });
    };

    function preventDefaultTouch(element: HTMLElement | SVGSVGElement | null) {
      if (!element) return;
      element.addEventListener('touchstart', function(e) {
        if (e.target && (
            (e.target as HTMLElement).id === 'dots' || 
            (e.target as HTMLElement).id === 'dots-container' || 
            (e.target as HTMLElement).tagName === 'svg' || 
            (e.target as HTMLElement).tagName === 'circle')) {
          e.preventDefault();
        }
      }, { passive: false });
      element.addEventListener('touchmove', function(e) {
        if (e.target && (
            (e.target as HTMLElement).id === 'dots' || 
            (e.target as HTMLElement).id === 'dots-container' || 
            (e.target as HTMLElement).tagName === 'svg' || 
            (e.target as HTMLElement).tagName === 'circle')) {
          e.preventDefault();
        }
      }, { passive: false });
    }

    function applyTouchOptimization() {
      var dotsContainer = document.getElementById('dots-container');
      var dots = document.getElementById('dots');
      if (dotsContainer) {
        dotsContainer.style.touchAction = 'none';
        preventDefaultTouch(dotsContainer);
      }
      if (dots) {
        dots.style.touchAction = 'none';
        preventDefaultTouch(dots);
      }
      var buttonsToFix = [
        'download-image', 'share-twitter', 'share-facebook', 
        'share-instagram', 'try-again', 'shuffle-button'
      ];
      buttonsToFix.forEach(function(id: string) {
        var button = document.getElementById(id);
        if (button) {
          button.style.touchAction = 'manipulation';
          button.style.cursor = 'pointer';
          button.addEventListener('touchstart', function(e) {
            e.stopPropagation();
          }, {passive: true});
          button.addEventListener('touchend', function(this: HTMLElement, e: TouchEvent) {
            e.stopPropagation();
            this.click();
          }, {passive: true});
        }
      });
      if (dots) { 
        var observer = new MutationObserver(function(mutations) {
          mutations.forEach(function(mutation) {
            if (mutation.addedNodes && mutation.addedNodes.length) {
              const currentDots = document.getElementById('dots'); 
              if (!currentDots) return;
              var svg = currentDots.querySelector('svg');
              if (svg) {
                svg.style.touchAction = 'none';
                preventDefaultTouch(svg); 
                console.log('Touch optimization applied to SVG');
              }
            }
          });
        });
        observer.observe(dots, { childList: true });
      }
    }
    setTimeout(applyTouchOptimization, 500);

    (window as any).backgroundOptions = [
      '/img/background-img1.png',
      '/img/background-img2.png', 
      '/img/background-img3.png',
      '/img/background-img4.png'
    ];

    (window as any).quotes = [
      "Reveal beauty one circle at a time.",
      "In every exploration lies a discovery.",
      "Through patience, the image emerges.",
      "Uncover the magic beneath the surface.",
      "Moments of discovery, captured in circles.",
      "Beneath the layers, truth unfolds.",
      "Gently revealing what was always there."
    ];

    (window as any).processUploadedFile = function(file: File) {}; // Typed placeholder

    (window as any).mobileShareCardSupport = function() {
      (window as any).originalCardWidth = 1800;
      (window as any).originalCardHeight = 1000;
      (window as any).originalBubbleSize = 720;
      (window as any).originalBubbleX = 65;

      if (window.matchMedia("(max-width: 1000px)").matches) {
        console.log("Mobile device detected - ensuring card layout is preserved");
        (window as any).adjustMobileSvgSize = function() {
          setTimeout(function() {
            var dotsContainer = document.getElementById('dots-container');
            var svg = dotsContainer ? dotsContainer.querySelector('svg') : null;
            if (svg) {
              svg.setAttribute('width', '400');
              svg.setAttribute('height', '400');
              svg.setAttribute('viewBox', '0 0 512 512');
              svg.style.width = '100%'; 
              svg.style.height = 'auto';
              svg.style.maxWidth = '400px';
              console.log("Mobile SVG size adjusted");
            }
          }, 500);
        };

        var dotsContainer = document.getElementById('dots-container');
        if (dotsContainer) {
            var observer = new MutationObserver(function(mutations) {
                mutations.forEach(function(mutation) {
                    if ((mutation.target as HTMLElement).style.display === 'block') {
                        (window as any).adjustMobileSvgSize();
                    }
                });
            });
            observer.observe(dotsContainer, { attributes: true, attributeFilter: ['style'] });
        }
      }
    };

    if (typeof (window as any).setupInteractions === 'function') {
        (window as any).setupInteractions(); 
    }
    if (typeof (window as any).mobileShareCardSupport === 'function') {
        (window as any).mobileShareCardSupport();
    }

    (window as any).shownFile = 'none';
    (window as any).userUploadedImage = false;
    (window as any).sharingButtonsShown = false;

    (function() {
      var now = +new Date();
      (window as any).gaTrack = function(type: string, subtype: string) {
        var time = Math.round((+new Date() - now) / 1000);
        function doTrack() {
          if (!(window as any)._gaq) return;
          (window as any)._gaq.push(['_trackEvent', String(type), String(subtype), window.location.href, time]);
        }
        if ((window as any)._gaq) {
          doTrack()
        } else {
          setTimeout(doTrack, 1);
        }
      }
    })();

    if (typeof (window as any).init === 'function') { 
      (window as any).init(); 
    }
    
    const cardContainer = document.getElementById('card-container');
    if (cardContainer) {
      d3.select('#dots-container').style('display', 'none');
      if (!cardContainer.style.backgroundImage || cardContainer.style.backgroundImage === '') {
        const backgroundOptions = (window as any).backgroundOptions || [];
        if (backgroundOptions.length > 0) {
            const randomIndex = Math.floor(Math.random() * backgroundOptions.length);
            const bgImage = backgroundOptions[randomIndex];
            cardContainer.style.backgroundImage = 'url(' + bgImage + ')';
            console.log("Manually set background image to: " + bgImage);
        }
      }
      d3.select(cardContainer).style('display', 'block');
    }
    d3.select('#quote-container').style('display', 'block');
    const quotes = (window as any).quotes || [];
    if (quotes.length > 0) {
        const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
        d3.select('#random-quote')
          .html('"' + randomQuote + '"')
          .style('font-family', '"Playfair Display", Georgia, serif')
          .style('font-size', '32px')
          .style('font-style', 'italic')
          .style('line-height', '1.4')
          .style('color', '#1A202C')
          .style('text-shadow', '0 1px 2px rgba(255, 255, 255, 0.7)');
    }

    function setupCardUploadDragAndDrop() {
      var uploadArea = document.getElementById('card-upload-area');
      if (!uploadArea) return;
      uploadArea.addEventListener('dragover', function(e) {
        e.preventDefault();
        e.stopPropagation();
      });
      uploadArea.addEventListener('dragleave', function(e) {
        e.preventDefault();
        e.stopPropagation();
      });
      uploadArea.addEventListener('drop', function(e) {
        e.preventDefault();
        e.stopPropagation();
        if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files.length > 0) {
          if (typeof (window as any).processUploadedFile === 'function') {
            (window as any).processUploadedFile(e.dataTransfer.files[0]);
          }
        }
      });
    }
    setupCardUploadDragAndDrop();

  }, []);

  return (
    <>
      <div id="center">
        <div id="cont">
          <noscript>
            Your browser does not support JavaScript or it is disabled.<br/>
            JavaScript is needed to view this site.
          </noscript>
          <div id="card-container" style={{ display: 'none', position: 'relative', width: '100%', height: '100%', backgroundImage: 'url(/img/background-img1.png)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
            <div id="shuffle-button" style={{ position: 'absolute', top: '15px', right: '15px', width: '34px', height: '34px', backgroundColor: 'rgba(255, 255, 255, 0.8)', borderRadius: '50%', display: 'none', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)', zIndex: 10, transition: 'all 0.2s ease', WebkitTapHighlightColor: 'transparent', touchAction: 'manipulation' }}>
              <div style={{ width: '20px', height: '20px', backgroundImage: 'url(\'data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%2724%27 height=%2724%27 viewBox=%270 0 24 24%27%3E%3Cpath fill=%27%234682b4%27 d=%27M14.73 19q-.212 0-.355-.144t-.144-.357t.144-.356t.356-.143h2.6l-3.168-3.167q-.146-.147-.153-.348t.16-.366q.164-.165.356-.165t.357.165L18 17.242V14.79q0-.213.144-.357t.357-.143t.356.143t.143.357v3.403q0 .344-.232.576t-.576.232zm-9.584-.146q-.16-.16-.16-.354t.16-.354L17.292 6h-2.561q-.213 0-.356-.144t-.144-.357t.144-.356T14.73 5h3.461q.344 0 .576.232t.232.576v3.404q0 .212-.144-.356t-.357-.144t-.356-.144T18 9.212V6.708L5.854 18.854q-.14.14-.344.15t-.364-.15m-.005-13.02Q5 5.695 5.01 5.492t.146-.345t.341-.14t.351.14l3.893 3.906q.14.14.143.332q.003.191-.143.34q-.134.138-.342.138q-.207 0-.347-.14z%27/%3E%3C/svg%3E\')', backgroundSize: 'contain', backgroundRepeat: 'no-repeat', backgroundPosition: 'center' }}></div>
            </div>
            <div id="dots-container" style={{ position: 'absolute', left: '30px', top: '50%', transform: 'translateY(-50%)', display: 'none', overflow: 'hidden', touchAction: 'none' }}>
              <div id="dots" style={{ touchAction: 'none' }}></div>
            </div>
            <div id="card-upload-area" style={{ position: 'absolute', left: '30px', top: '50%', transform: 'translateY(-50%)', width: '45%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', borderRadius: '16px', padding: '20px' }}>
              <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                <div style={{ fontFamily: '\'Playfair Display\', Georgia, serif', fontSize: '22px', fontWeight: 500, marginBottom: '12px', color: '#2D3748' }}>Discover Your Image</div>
                <div style={{ fontFamily: '\'Inter\', sans-serif', fontSize: '13px', lineHeight: 1.6, marginBottom: '20px', color: '#4A5568' }}>Upload a photo and reveal it gradually</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', width: '100%', position: 'relative', padding: '20px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
                  <div style={{ marginBottom: '16px' }}>
                    <svg fill="none" height="54" viewBox="0 0 24 24" width="54" xmlns="http://www.w3.org/2000/svg">
                      <rect fill="rgba(255, 255, 255, 0.7)" height="18" rx="4" stroke="#4682b4" strokeWidth="1.5" width="18" x="3" y="3"></rect>
                      <circle cx="8.5" cy="8.5" fill="#4682b4" r="1.5"></circle>
                      <path d="M3 17L8 12L10 14L15 9L21 15V17C21 19.2091 19.2091 21 17 21H7C4.79086 21 3 19.2091 3 17Z" fill="#4682b4" fillOpacity="0.6"></path>
                      <path d="M12 16V11M12 11L9 14M12 11L15 14" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"></path>
                    </svg>
                  </div>
                  <div style={{ fontFamily: '\'Inter\', sans-serif', fontWeight: 500, color: '#4682b4', marginBottom: '8px', padding: '7px 14px', borderRadius: '8px', backgroundColor: 'rgba(70, 130, 180, 0.1)' }}>Choose an image</div>
                </div>
                <input accept="image/*" id="card-image-upload" style={{ opacity: 0, position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', cursor: 'pointer' }} title="" type="file"/>
              </div>
            </div>
            <div id="quote-container" style={{ position: 'absolute', right: '30px', top: '50%', transform: 'translateY(-50%)', width: '42%', textAlign: 'left' }}>
              <div id="random-quote"></div>
            </div>
            <div id="footer-text" style={{ position: 'absolute', bottom: '18px', width: '100%', textAlign: 'center', fontFamily: '\'Playfair Display\', Georgia, serif', fontStyle: 'italic', fontSize: '13px', color: '#4A5568' }}>
              Interactive Image Explorer built by <span style={{ display: 'inline-block', width: '16px', height: '16px', borderRadius: '50%', backgroundImage: 'url(/img/20250320-105901.jpeg)', backgroundSize: 'cover', verticalAlign: 'middle', margin: '0 4px' }}></span> Niki
            </div>
          </div>
          <div id="sharing-buttons" style={{ display: 'none' }}>
            <div className="sharing-container">
              <button className="share-button" id="download-image" style={{ position: 'relative', zIndex: 999, touchAction: 'manipulation' }}>
                <svg fill="none" height="20" viewBox="0 0 24 24" width="20" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                  <path d="M7 10L12 15L17 10" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                  <path d="M12 15V3" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                </svg>
                <span>Download</span>
              </button>
              <button className="share-button" id="share-twitter" style={{ position: 'relative', zIndex: 999, touchAction: 'manipulation' }}>
                <svg fill="none" height="20" viewBox="0 0 24 24" width="20" xmlns="http://www.w3.org/2000/svg">
                  <path d="M23 3.01006C22.0424 3.68553 20.9821 4.20217 19.86 4.54006C19.2577 3.84757 18.4573 3.35675 17.567 3.13398C16.6767 2.91122 15.7395 2.96725 14.8821 3.29451C14.0247 3.62177 13.2884 4.20446 12.773 4.96377C12.2575 5.72309 11.9877 6.62239 12 7.54006V8.54006C10.2426 8.58562 8.50127 8.19587 6.93101 7.4055C5.36074 6.61513 4.01032 5.44869 3 4.01006C3 4.01006 -1 13.0101 8 17.0101C5.94053 18.408 3.48716 19.109 1 19.0101C10 24.0101 21 19.0101 21 7.51006C20.9991 7.23151 20.9723 6.95365 20.92 6.68006C21.9406 5.67355 22.6608 4.40277 23 3.01006Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                </svg>
                <span>Twitter</span>
              </button>
              <button className="share-button" id="share-facebook" style={{ position: 'relative', zIndex: 999, touchAction: 'manipulation' }}>
                <svg fill="none" height="20" viewBox="0 0 24 24" width="20" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18 2H15C13.6739 2 12.4021 2.52678 11.4645 3.46447C10.5268 4.40215 10 5.67392 10 7V10H7V14H10V22H14V14H17L18 10H14V7C14 6.73478 14.1054 6.48043 14.2929 6.29289C14.4804 6.10536 14.7348 6 15 6H18V2Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                </svg>
                <span>Facebook</span>
              </button>
              <button className="share-button" id="share-instagram" style={{ position: 'relative', zIndex: 999, touchAction: 'manipulation' }}>
                <svg fill="none" height="20" viewBox="0 0 24 24" width="20" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17 2H7C4.23858 2 2 4.23858 2 7V17C2 19.7614 4.23858 22 7 22H17C19.7614 22 22 19.7614 22 17V7C22 4.23858 19.7614 2 17 2Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                  <path d="M16 11.37C16.1234 12.2022 15.9813 13.0522 15.5938 13.799C15.2063 14.5458 14.5932 15.1514 13.8416 15.5297C13.0901 15.9079 12.2385 16.0396 11.4078 15.9059C10.5771 15.7723 9.80977 15.3801 9.21485 14.7852C8.61993 14.1902 8.22774 13.4229 8.09408 12.5922C7.96042 11.7615 8.09208 10.9099 8.47034 10.1584C8.8486 9.40685 9.4542 8.79374 10.201 8.40624C10.9478 8.01874 11.7978 7.87659 12.63 8C13.4789 8.12588 14.2649 8.52146 14.8717 9.1283C15.4785 9.73515 15.8741 10.5211 16 11.37Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                  <path d="M17.5 6.5H17.51" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                </svg>
                <span>Instagram</span>
              </button>
            </div>
          </div>
          <div id="next" style={{ display: 'none' }}>
            <div className="complete-title">Awesome!</div>
            <div className="complete-subtitle">You've revealed the image. Want to try another one?</div>
            <button id="try-again" style={{ position: 'relative', zIndex: 999, touchAction: 'manipulation' }}>Try Another Image</button>
          </div>
        </div>
      </div>
      <div id="footer">
        <div className="copyright">
          Based on <a href="https://github.com/vogievetsky/KoalasToTheMax">KoalasToTheMax</a> by Vadim Ogievetsky © 2012
          <span className="separator">|</span>
          Recreated with custom functionality by <a href="https://www.yourware.so/profile/R4231xOUOwO9YsE7hVfi1CXMgCl2">Niki</a>
          <span className="separator">|</span>
          Powered by <a href="http://d3js.org/">D3</a>
        </div>
      </div>
    </>
  );
}
