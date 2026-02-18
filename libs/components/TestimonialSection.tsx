
import React, { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { Star, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { GET_FEATURED_TESTIMONIALS } from '../../apollo/user/query';
import { BackendTestimonial } from '../types/index';

interface FeaturedTestimonial {
  id: string;
  text: string;
  rating: number;
  authorName: string;
  authorRole: string;
  authorCompany: string;
  authorAvatar?: string;
}

// Fallback testimonials when backend is not available
const fallbackTestimonials: FeaturedTestimonial[] = [
  {
    id: 'fallback-1',
    text: "SME Connect transformed how we source external legal and accounting support. The verification process gives us peace of mind that we're hiring top-tier talent.",
    rating: 5,
    authorName: 'Sarah Jenkins',
    authorRole: 'CEO',
    authorCompany: 'TechFlow Systems',
    authorAvatar: 'https://picsum.photos/seed/sarah/100/100',
  },
  {
    id: 'fallback-2',
    text: "The platform streamlined our vendor management process completely. We reduced our procurement cycle by 60% and found service providers we trust for long-term partnerships.",
    rating: 5,
    authorName: 'Michael Chen',
    authorRole: 'COO',
    authorCompany: 'DataPulse Inc.',
    authorAvatar: 'https://picsum.photos/seed/michael/100/100',
  },
  {
    id: 'fallback-3',
    text: "Finding reliable IT partners used to take months. With SME Connect, we had three verified cybersecurity firms bidding on our project within 48 hours.",
    rating: 5,
    authorName: 'Emma Rodriguez',
    authorRole: 'CTO',
    authorCompany: 'NexGen Solutions',
    authorAvatar: 'https://picsum.photos/seed/emma/100/100',
  },
];

const TestimonialSection: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  // Fetch featured testimonials from backend
  const { data, loading } = useQuery(GET_FEATURED_TESTIMONIALS, {
    variables: { limit: 10 },
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'all',
  });

  // Map backend data to frontend format
  const dynamicTestimonials: FeaturedTestimonial[] = (data?.getFeaturedTestimonials || []).map(
    (t: BackendTestimonial) => ({
      id: t._id,
      text: t.text,
      rating: t.rating,
      authorName: t.authorName,
      authorRole: t.authorRole,
      authorCompany: t.authorCompany,
      authorAvatar: t.authorAvatar,
    })
  );

  // Use dynamic testimonials from backend, fallback to static data
  const testimonials = dynamicTestimonials.length > 0 ? dynamicTestimonials : fallbackTestimonials;

  const currentTestimonial = testimonials[activeIndex] || testimonials[0];

  const goToNext = () => {
    setActiveIndex((prev) => (prev + 1) % testimonials.length);
  };

  const goToPrev = () => {
    setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  // Auto-rotate every 8 seconds
  useEffect(() => {
    if (testimonials.length <= 1) return;
    const interval = setInterval(goToNext, 8000);
    return () => clearInterval(interval);
  }, [testimonials.length, activeIndex]);

  return (
    <section className="py-24 px-4 bg-white dark:bg-slate-800 transition-colors">
      <div className="max-w-6xl mx-auto bg-slate-900 dark:bg-slate-800 rounded-[3rem] p-12 md:p-24 text-center text-white relative overflow-hidden transition-colors">
        {/* Abstract shapes */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 blur-3xl rounded-full"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 blur-3xl rounded-full"></div>

        <div className="relative z-10">
          {loading && (
            <div className="flex justify-center mb-4">
              <Loader2 className="w-5 h-5 animate-spin text-indigo-400" />
            </div>
          )}

          <div className="flex justify-center gap-1 mb-10">
            {[...Array(currentTestimonial.rating || 5)].map((_, i) => (
              <Star key={i} className="w-6 h-6 fill-yellow-400 text-yellow-400" />
            ))}
          </div>

          <h2 className="text-2xl md:text-4xl font-medium leading-relaxed italic mb-12 max-w-4xl mx-auto">
            "{currentTestimonial.text}"
          </h2>

          <div className="flex flex-col items-center gap-4">
            {currentTestimonial.authorAvatar && (
              <img 
                src={currentTestimonial.authorAvatar} 
                alt={currentTestimonial.authorName} 
                className="w-16 h-16 rounded-full border-2 border-slate-700 dark:border-slate-600 p-1"
              />
            )}
            <div>
              <p className="font-bold text-xl">{currentTestimonial.authorName}</p>
              <p className="text-slate-400 dark:text-slate-300 text-base">
                {currentTestimonial.authorRole}, {currentTestimonial.authorCompany}
              </p>
            </div>
          </div>

          {/* Navigation arrows & dots */}
          {testimonials.length > 1 && (
            <div className="flex items-center justify-center gap-4 mt-10">
              <button
                onClick={goToPrev}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                aria-label="Previous testimonial"
              >
                <ChevronLeft className="w-5 h-5 text-white" />
              </button>
              <div className="flex items-center gap-2">
                {testimonials.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveIndex(idx)}
                    className={`w-2.5 h-2.5 rounded-full transition-all ${
                      idx === activeIndex ? 'bg-indigo-400 w-6' : 'bg-white/30 hover:bg-white/50'
                    }`}
                    aria-label={`Go to testimonial ${idx + 1}`}
                  />
                ))}
              </div>
              <button
                onClick={goToNext}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                aria-label="Next testimonial"
              >
                <ChevronRight className="w-5 h-5 text-white" />
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default TestimonialSection;
