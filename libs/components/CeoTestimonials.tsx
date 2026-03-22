import React from 'react';
import Image from 'next/image';

interface CeoTestimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  avatar: string;
  quote: string;
}

const ceos: CeoTestimonial[] = [
  {
    id: 'ceo-1',
    name: 'Sundar Pichai',
    role: 'CEO',
    company: 'Alphabet & Google',
    avatar: '/people/images.webp',
    quote: 'SME Connect is now our default way to source specialist partners across regions.',
  },
  {
    id: 'ceo-2',
    name: 'Elon Musk',
    role: 'CEO',
    company: 'Tesla, SpaceX & xAI',
    avatar: '/people/Elon_Musk_-_54820081119_(cropped).jpg.webp',
    quote: 'The verified pool of providers lets our team move from idea to launch much faster.',
  },
  {
    id: 'ceo-3',
    name: 'Jensen Huang',
    role: 'Founder & CEO',
    company: 'NVIDIA',
    avatar: '/people/NVIDIA-Jensen-Huang (1).webp',
    quote: 'We can spin up expert squads for niche projects without slowing our roadmap.',
  },
  {
    id: 'ceo-4',
    name: 'Mark Zuckerberg',
    role: 'Founder & CEO',
    company: 'Meta',
    avatar: '/people/mark-zuckerberg@2x.webp',
    quote: 'Having trusted agencies on tap has simplified how we experiment and iterate.',
  },
];

const CeoTestimonials: React.FC = () => {
  return (
    <section className="relative overflow-hidden bg-white py-24 dark:bg-slate-950 md:py-32">
      <div className="relative">
        <div className="mx-auto w-full max-w-[1400px] px-4 sm:px-6 lg:px-8">
          <div className="mb-12 flex flex-col items-center gap-4 text-center md:mb-16">
            <h2 className="font-sans text-3xl font-bold tracking-tight text-slate-900 dark:text-white md:text-4xl lg:text-[2.5rem]">
              Global Tech Leaders Choose Us
            </h2>
            <p className="max-w-2xl text-base font-normal leading-relaxed text-slate-600 dark:text-slate-400 md:text-lg">
              Real feedback from leaders who use SME Connect to <span className="font-medium text-slate-800 dark:text-slate-200">find vetted providers</span>, compare options, and{' '}
              <span className="font-medium text-slate-800 dark:text-slate-200">run external projects</span> with less friction. Below: name, title, company, then their quote.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8 xl:grid-cols-4 xl:gap-8">
            {ceos.map((ceo) => (
              <article
                key={ceo.id}
                className="group relative flex min-h-0 w-full flex-col overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-8 text-center shadow-[0_2px_8px_rgba(15,23,42,0.04),0_8px_24px_rgba(15,23,42,0.06)] transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-2 hover:border-slate-300 hover:shadow-[0_20px_50px_rgba(0,0,0,0.1),0_8px_24px_rgba(15,23,42,0.08)] dark:border-white/10 dark:bg-slate-900 dark:shadow-[0_2px_8px_rgba(0,0,0,0.25)] dark:hover:border-white/40 dark:hover:shadow-[0_20px_50px_rgba(0,0,0,0.45),0_12px_32px_rgba(0,0,0,0.35)] md:p-10"
              >
                <div
                  className="pointer-events-none absolute inset-0 rounded-3xl bg-gradient-to-br from-white/60 via-transparent to-transparent opacity-0 transition-opacity duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:opacity-100 dark:from-white/[0.12] dark:via-transparent"
                  aria-hidden
                />

                <div className="relative z-10 flex flex-col items-center text-center">
                  <div className="relative mx-auto mb-6 h-28 w-28 shrink-0 overflow-hidden rounded-full ring-1 ring-slate-200/90 ring-offset-2 ring-offset-white dark:ring-slate-600 dark:ring-offset-slate-900 md:h-32 md:w-32">
                    <Image
                      src={ceo.avatar}
                      alt={ceo.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1280px) 128px, 160px"
                    />
                  </div>

                  <p className="font-sans text-lg font-bold tracking-tight text-slate-900 dark:text-white md:text-xl">{ceo.name}</p>
                  <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400" title={`${ceo.role} at ${ceo.company}`}>
                    <span className="font-medium text-slate-600 dark:text-slate-300">{ceo.role}</span>
                    <span className="text-slate-300 dark:text-slate-600"> · </span>
                    <span>{ceo.company}</span>
                  </p>

                  <p className="mt-8 text-center text-[15px] font-normal leading-relaxed text-slate-700 dark:text-slate-300 md:text-base">
                    &ldquo;{ceo.quote}&rdquo;
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CeoTestimonials;
