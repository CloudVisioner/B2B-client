import React, { useState, useEffect } from 'react';
import Image from 'next/image';

interface Logo {
  name: string;
  component: React.ReactNode;
  isImage?: boolean;
  imageSrc?: string;
}

const logos: Logo[] = [
  {
    name: 'Microsoft',
    isImage: true,
    imageSrc: '/logos/microsoft.svg',
    component: (
      <Image
        src="/logos/microsoft.svg"
        alt="Microsoft"
        width={120}
        height={50}
        className="h-full w-auto object-contain"
      />
    ),
  },
  {
    name: 'Google',
    isImage: true,
    imageSrc: '/logos/google.svg',
    component: (
      <Image
        src="/logos/google.svg"
        alt="Google"
        width={120}
        height={50}
        className="h-full w-auto object-contain"
      />
    ),
  },
  {
    name: 'Apple',
    isImage: true,
    imageSrc: '/logos/apple.svg',
    component: (
      <Image
        src="/logos/apple.svg"
        alt="Apple"
        width={120}
        height={50}
        className="h-full w-auto object-contain"
      />
    ),
  },
  {
    name: 'AWS',
    isImage: true,
    imageSrc: '/logos/idS5TK0MYh_1771924134111.webp',
    component: (
      <Image
        src="/logos/idS5TK0MYh_1771924134111.webp"
        alt="AWS"
        width={140}
        height={60}
        className="h-full w-auto object-contain"
      />
    ),
  },
  {
    name: 'NVIDIA',
    isImage: true,
    imageSrc: '/logos/nvidia.webp',
    component: (
      <Image
        src="/logos/nvidia.webp"
        alt="NVIDIA"
        width={120}
        height={50}
        className="h-full w-auto object-contain"
      />
    ),
  },
  {
    name: 'OpenAI',
    isImage: true,
    imageSrc: '/logos/OpenAI_Logo_0.webp',
    component: (
      <Image
        src="/logos/OpenAI_Logo_0.webp"
        alt="OpenAI"
        width={210}
        height={90}
        className="h-full w-auto object-contain"
      />
    ),
  },
  {
    name: 'Samsung',
    isImage: true,
    imageSrc: '/logos/Samsung_idrZcaRCpR_0.webp',
    component: (
      <Image
        src="/logos/Samsung_idrZcaRCpR_0.webp"
        alt="Samsung"
        width={120}
        height={50}
        className="h-full w-auto object-contain"
      />
    ),
  },
  {
    name: 'Symbol',
    isImage: true,
    imageSrc: '/logos/Symbol.webp',
    component: (
      <Image
        src="/logos/Symbol.webp"
        alt="Symbol"
        width={120}
        height={50}
        className="h-full w-auto object-contain"
      />
    ),
  },
  {
    name: 'Facebook',
    isImage: false,
    component: (
      <svg className="h-full w-auto" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M24 12.073c0-6.627-5.373-12-12-12S0 5.446 0 12.073c0 6.024 4.388 11.02 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" fill="#1877F2"/>
      </svg>
    ),
  },
];

const MovingLogos: React.FC = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Return static logos during SSR
    return (
      <>
        <style dangerouslySetInnerHTML={{
          __html: `
            .logo-item-static svg,
            .logo-item-static img {
              max-width: 100%;
              max-height: 100%;
              width: auto;
              height: auto;
              object-fit: contain;
              filter: brightness(0) invert(0);
            }
            
            /* All logos should be black/white */
            .dark .logo-item-static svg,
            .dark .logo-item-static img {
              filter: brightness(0) invert(1);
            }
            
            .logo-item-static img[alt="OpenAI"] {
              width: auto;
              height: 150%;
              max-width: none;
              max-height: 150%;
            }
          `
        }} />
        <div className="relative w-full overflow-hidden">
          <div className="flex gap-16 items-center justify-center">
            {logos.map((logo, index) => (
              <div
                key={`${logo.name}-${index}`}
                className="logo-item-static flex-shrink-0 flex items-center justify-center w-[140px] h-[60px] opacity-90 p-2"
              >
                {logo.component}
              </div>
            ))}
          </div>
        </div>
      </>
    );
  }

  // Duplicate logos for seamless infinite scroll (need 2 sets for CSS animation)
  const duplicatedLogos = [...logos, ...logos];

  return (
    <>
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes logo-scroll {
            from {
              transform: translate3d(0, 0, 0);
            }
            to {
              transform: translate3d(-50%, 0, 0);
            }
          }
          
          .logo-slider-container {
            overflow: hidden;
            display: flex;
            user-select: none;
            position: relative;
            mask-image: linear-gradient(to right, transparent 0%, transparent 5%, black 8%, black 92%, transparent 95%, transparent 100%);
            -webkit-mask-image: linear-gradient(to right, transparent 0%, transparent 5%, black 8%, black 92%, transparent 95%, transparent 100%);
          }
          
          .logo-track {
            display: flex;
            align-items: center;
            width: max-content;
            will-change: transform;
            animation: logo-scroll 30s linear infinite;
            backface-visibility: hidden;
            perspective: 1000px;
            gap: 4rem;
          }
          
          .logo-item {
            flex-shrink: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            width: 140px;
            height: 60px;
            padding: 8px;
            opacity: 0.9;
            transition: opacity 0.2s ease;
          }
          
          .logo-item svg,
          .logo-item img {
            max-width: 100%;
            max-height: 100%;
            width: auto;
            height: auto;
            object-fit: contain;
            filter: brightness(0) invert(0);
          }
          
          /* All logos should be black/white */
          .dark .logo-item svg,
          .dark .logo-item img {
            filter: brightness(0) invert(1);
          }
          
          .logo-item img[alt="OpenAI"] {
            width: auto;
            height: 150%;
            max-width: none;
            max-height: 150%;
          }
          
          .logo-item:hover {
            opacity: 1;
          }
          
          .logo-slider-container:hover .logo-track {
            animation-play-state: paused;
          }
          
          @media (min-width: 768px) {
            .logo-track {
              gap: 4rem;
            }
            .logo-item {
              width: 140px;
              height: 60px;
            }
          }
          
          @media (min-width: 1024px) {
            .logo-track {
              gap: 4rem;
            }
            .logo-item {
              width: 140px;
              height: 60px;
            }
          }
        `
      }} />
      <div className="logo-slider-container relative w-full py-4">
        <div className="logo-track">
          {duplicatedLogos.map((logo, index) => (
            <div
              key={`${logo.name}-${index}`}
              className="logo-item"
            >
              {logo.component}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default MovingLogos;
