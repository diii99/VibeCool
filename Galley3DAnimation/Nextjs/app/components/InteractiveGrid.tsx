'use client';

import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import imagesLoaded from 'imagesloaded';
import Lenis from '@studio-freight/lenis';

// Helper function (can be outside the component if it doesn't rely on component scope)
const isLeftSide = (element: HTMLElement | null): boolean => {
  if (!element) return false;
  const elementCenter = element.getBoundingClientRect().left + element.offsetWidth / 2;
  const viewportCenter = window.innerWidth / 2;
  return elementCenter < viewportCenter;
};

export default function InteractiveGrid() {
  const [isLoading, setIsLoading] = useState(true);
  
  const mainContainerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const marqueeInnerRef = useRef<HTMLDivElement>(null);
  const textElementRef = useRef<HTMLDivElement>(null);
  const gridFullRef = useRef<HTMLDivElement>(null);
  // Refs for credits will be querySelectorAll within mainContainerRef

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    let lenisInstance: Lenis | null = null;
    
    const ctx = gsap.context(() => {
      if (mainContainerRef.current) {
        const allImages = mainContainerRef.current.querySelectorAll('.grid__item-img, .grid__item-imgwrap');
        
        imagesLoaded(allImages, { background: true }, () => {
          setIsLoading(false);
          if (typeof window !== "undefined") {
              document.body.classList.remove('loading'); // Manage globally if possible
          }
          
          // Animation functions adapted for refs
          const animateScrollGrid = () => {
            if (!gridRef.current) return;
            const gridImages = gridRef.current.querySelectorAll('.grid__item-imgwrap');
            gridImages.forEach(imageWrap => {
              const imgEl = imageWrap.querySelector('.grid__item-img');
              const left = isLeftSide(imageWrap as HTMLElement);
              gsap.timeline({
                scrollTrigger: {
                  trigger: imageWrap,
                  start: 'top bottom+=10%',
                  end: 'bottom top-=25%',
                  scrub: true,
                }
              })
              .from(imageWrap, {
                startAt: { filter: 'blur(0px) brightness(100%) contrast(100%)' },
                z: 300,
                rotateX: 70,
                rotateZ: left ? 5 : -5,
                xPercent: left ? -40 : 40,
                skewX: left ? -20 : 20,
                yPercent: 100,
                filter: 'blur(7px) brightness(0%) contrast(400%)',
                ease: 'sine',
              })
              .to(imageWrap, {
                z: 300,
                rotateX: -50,
                rotateZ: left ? -1 : 1,
                xPercent: left ? -20 : 20,
                skewX: left ? 10 : -10,
                filter: 'blur(4px) brightness(0%) contrast(500%)',
                ease: 'sine.in',
              })
              .from(imgEl, { scaleY: 1.8, ease: 'sine' }, 0)
              .to(imgEl, { scaleY: 1.8, ease: 'sine.in' }, '>');
            });
          };

          const animateMarquee = () => {
            if (!marqueeInnerRef.current || !gridRef.current) return;
            gsap.timeline({
              scrollTrigger: {
                trigger: gridRef.current,
                start: 'top bottom',
                end: 'bottom top',
                scrub: true,
              }
            })
            .fromTo(marqueeInnerRef.current, { x: '100vw' }, { x: '-100%', ease: 'none' }); // Changed ease to none for linear scroll
          };

          const animateTextElement = () => {
            if (!textElementRef.current) return;
            gsap.timeline({
              scrollTrigger: {
                trigger: textElementRef.current,
                start: 'top bottom',
                end: 'center center-=25%',
                scrub: true,
              }
            })
            .from(textElementRef.current, {
              ease: 'sine',
              yPercent: 300,
              autoAlpha: 0,
            });
          };

          const animateGridFull = () => {
            if (!gridFullRef.current) return;
            const gridFullItems = Array.from(gridFullRef.current.querySelectorAll('.grid__item')) as HTMLElement[];
            if (gridFullItems.length === 0) return;

            const numColumns = getComputedStyle(gridFullRef.current).getPropertyValue('grid-template-columns').split(' ').length || 1;
            const middleColumnIndex = Math.floor(numColumns / 2);
            const columns: HTMLElement[][] = Array.from({ length: numColumns }, () => []);
            gridFullItems.forEach((item, index) => {
              const columnIndex = index % numColumns;
              columns[columnIndex].push(item);
            });

            columns.forEach((columnItems, columnIndex) => {
              if (columnItems.length === 0) return;
              const delayFactor = Math.abs(columnIndex - middleColumnIndex) * 0.2;
              gsap.timeline({
                scrollTrigger: {
                  trigger: gridFullRef.current,
                  start: 'top bottom',
                  end: 'center center',
                  scrub: true,
                }
              })
              .from(columnItems, {
                yPercent: 450,
                autoAlpha: 0,
                delay: delayFactor,
                ease: 'sine',
              })
              .from(columnItems.map(item => item.querySelector('.grid__item-img')), {
                transformOrigin: '50% 0%',
                ease: 'sine',
              }, 0);
            });
          };

          const animateCredits = () => {
            if (!mainContainerRef.current) return;
            const creditsTexts = mainContainerRef.current.querySelectorAll('.credits');
            creditsTexts.forEach(creditsText => {
              gsap.timeline({
                scrollTrigger: {
                  trigger: creditsText,
                  start: 'top bottom',
                  end: 'clamp(bottom top)',
                  scrub: true,
                }
              })
              .fromTo(creditsText, { x: 100 }, { x: 0, ease: 'sine' });
            });
          };

          // Initialize animations
          animateScrollGrid();
          animateMarquee();
          animateTextElement();
          animateGridFull();
          animateCredits();

          // Initialize Lenis
          lenisInstance = new Lenis();
          const raf = (time: number) => {
            lenisInstance?.raf(time);
            requestAnimationFrame(raf);
          };
          requestAnimationFrame(raf);

          if (typeof window !== "undefined") {
            window.scrollTo(0, 0);
          }
        });
      }
    }, mainContainerRef); // Scope GSAP context to the main container

    return () => {
      ctx.revert(); // Revert all GSAP animations and ScrollTriggers
      if (lenisInstance) {
        lenisInstance.destroy();
        lenisInstance = null;
      }
      if (typeof window !== "undefined") {
        // Potentially re-add loading class if necessary
        // document.body.classList.add('loading'); 
      }
    };
  }, []); // Empty dependency array means this runs once on mount and cleans up on unmount

  return (
    <div ref={mainContainerRef} className={`main-content ${isLoading ? 'content-loading' : 'content-loaded'}`}>
      <div className="frame">
        <a className="frame__back" href="https://www.yourware.so/blog">Article</a>
        <a className="frame__archive" href="https://www.yourware.so/">All demos</a>
        <a className="frame__github" href="https://discord.com/invite/YkRQD2YPjR">Discord</a>
      </div>
      <div className="intro">
        <h1 className="intro__title font-alt">Gallery (3D) <br />Grid Animations</h1>
        <nav className="tags">
          <a href="https://tympanus.net/codrops/demos/?tag=scroll">#scroll</a>
          <a href="https://tympanus.net/codrops/demos/?tag=3d">#3d</a>
          <a href="https://tympanus.net/codrops/demos/?tag=grid">#grid</a>
        </nav>
        <span className="intro__info">Scroll gently &amp; enjoy</span>
      </div>
      <section>
        <div className="grid" ref={gridRef}>
          {[...Array(24)].map((_, i) => {
            const imgNumber = (i % 20) + 1;
            const imageUrl = `/img/${imgNumber}.jpg`;
            return (
              <figure className="grid__item" key={`grid-item-${i}`}>
                <div className="grid__item-imgwrap">
                  <div className="grid__item-img" style={{backgroundImage: `url(${imageUrl})`}}></div>
                </div>
              </figure>
            );
          })}
        </div>
        <div className="mark">
          <div className="mark__inner font-alt" ref={marqueeInnerRef}>
            <span>Be Present</span> <span>在场/当下</span>
            <span>Less is More</span> <span>简胜</span>
            <span>Make Waves</span> <span>破浪</span>
            <span>Stay Hungry</span> <span>求渴</span>
            <span>Find Balance</span> <span>中和</span>
            <span>Just Be</span> <span>自在</span>
            <span>Dream Big</span> <span>远志</span>
            <span>Flow State</span> <span>忘我</span>
            <span>Be Limitless</span> <span>无限</span>
            <span>Mindful Moment</span> <span>明心</span>
          </div>
        </div>
      </section>
      <section>
        <div className="text font-alt" ref={textElementRef}>Think Different</div>
      </section>
      <section>
        <div className="grid grid--full" ref={gridFullRef}>
          {[...Array(35)].map((_, i) => {
            const imgNumber = (i % 20) + 1;
            const imageUrl = `/img/${imgNumber}.jpg`;
            return (
              <figure className="grid__item" key={`grid-full-item-${i}`}>
                <div className="grid__item-img" style={{backgroundImage: `url(${imageUrl})`}}></div>
              </figure>
            );
          })}
        </div>
      </section>
      <p className="credits font-alt">Made by <a href="https://www.yourware.so/">@Yourware</a></p>
      <p className="credits font-alt"><a href="https://www.yourware.so/">More Yourware</a></p>
    </div>
  );
} 