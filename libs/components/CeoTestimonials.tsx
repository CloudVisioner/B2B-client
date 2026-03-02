import React from 'react';
import Image from 'next/image';
import { Quote } from 'lucide-react';

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
    <section className="py-24 bg-slate-50 dark:bg-slate-950/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center text-center gap-4 mb-12">
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
            Global Tech Leaders Choose Us
          </h2>
          <p className="mt-1 text-slate-600 dark:text-slate-400 text-base md:text-lg max-w-2xl">
            Short, honest quotes from executives who use SME Connect to find and manage external partners.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-5xl mx-auto">
          {ceos.map((ceo) => (
            <article
              key={ceo.id}
              className="group relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-10 shadow-md hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
            >
              <div className="absolute -top-4 -right-4 w-10 h-10 rounded-2xl bg-indigo-500/10 dark:bg-indigo-500/20 flex items-center justify-center text-indigo-500 dark:text-indigo-300">
                <Quote className="w-4 h-4" />
              </div>

              <div className="flex flex-col items-center gap-4 mb-6 text-center">
                <div className="relative w-24 h-24 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700">
                  <Image
                    src={ceo.avatar}
                    alt={ceo.name}
                    fill
                    className="object-cover"
                    sizes="96px"
                  />
                </div>
                <div>
                  <p className="text-lg md:text-xl font-bold text-slate-900 dark:text-white">{ceo.name}</p>
                  <p className="text-xs md:text-sm font-semibold text-slate-500 dark:text-slate-400">
                    {ceo.role} · {ceo.company}
                  </p>
                </div>
              </div>

              <p className="text-base md:text-lg text-slate-700 dark:text-slate-300 leading-relaxed text-center">
                “{ceo.quote}”
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CeoTestimonials;

