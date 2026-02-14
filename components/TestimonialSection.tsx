
import React from 'react';
import { Star } from 'lucide-react';

const TestimonialSection: React.FC = () => {
  return (
    <section className="py-24 px-4">
      <div className="max-w-6xl mx-auto bg-slate-900 rounded-[3rem] p-12 md:p-24 text-center text-white relative overflow-hidden">
        {/* Abstract shapes */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 blur-3xl rounded-full"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 blur-3xl rounded-full"></div>

        <div className="relative z-10">
          <div className="flex justify-center gap-1 mb-10">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-6 h-6 fill-yellow-400 text-yellow-400" />
            ))}
          </div>

          <h2 className="text-2xl md:text-4xl font-medium leading-relaxed italic mb-12 max-w-4xl mx-auto">
            "SME Connect transformed how we source external legal and accounting support. The verification process gives us peace of mind that we're hiring top-tier talent."
          </h2>

          <div className="flex flex-col items-center gap-4">
            <img 
              src="https://picsum.photos/seed/sarah/100/100" 
              alt="Sarah Jenkins" 
              className="w-16 h-16 rounded-full border-2 border-slate-700 p-1"
            />
            <div>
              <p className="font-bold text-xl">Sarah Jenkins</p>
              <p className="text-slate-400 text-base">CEO, TechFlow Systems</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialSection;
