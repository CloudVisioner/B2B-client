import React from 'react';
import Image from 'next/image';

const LOGO_IMAGE_W = 240;
const LOGO_IMAGE_H = 96;

/** All assets in `public/logos` (no OpenAI). Order is stable for the marquee. */
const LOGO_ASSETS: { name: string; src: string; alt: string }[] = [
  { name: 'Walmart', src: '/logos/Walmart_Logo_1.png', alt: 'Walmart' },
  { name: 'Google', src: '/logos/google.svg', alt: 'Google' },
  { name: 'Apple', src: '/logos/apple.svg', alt: 'Apple' },
  { name: 'AWS', src: '/logos/idS5TK0MYh_1771924134111.webp', alt: 'AWS' },
  { name: 'NVIDIA', src: '/logos/nvidia.webp', alt: 'NVIDIA' },
  { name: 'Vercel', src: '/logos/vercel.png', alt: 'Vercel' },
  { name: 'Anthropic', src: '/logos/anthropic.webp', alt: 'Anthropic' },
  { name: 'Samsung', src: '/logos/Samsung_idrZcaRCpR_0.webp', alt: 'Samsung' },
  { name: 'Symbol', src: '/logos/Symbol.webp', alt: 'Symbol' },
];

function LogoImg({ src, alt }: { src: string; alt: string }) {
  return (
    <Image
      src={src}
      alt={alt}
      width={LOGO_IMAGE_W}
      height={LOGO_IMAGE_H}
      className="logo-marquee-img h-full w-full max-h-full max-w-full object-contain object-center"
    />
  );
}

/**
 * Infinite horizontal marquee — CSS only (`globals.css`: `.logo-marquee-*`).
 */
const MovingLogos: React.FC = () => {
  const loop = [...LOGO_ASSETS, ...LOGO_ASSETS];

  return (
    <div className="logo-marquee-container relative w-full py-4">
      <div className="logo-marquee-track">
        {loop.map((item, index) => (
          <div key={`${item.name}-${index}`} className="logo-marquee-item">
            <LogoImg src={item.src} alt={item.alt} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default MovingLogos;
