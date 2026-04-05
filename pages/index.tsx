import React from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import HowItWorks from '../libs/components/home/HowItWorks';
import TopCategories from '../libs/components/home/TopCategories';
import HomePremiumInteractive from '../libs/components/home/HomePremiumInteractive';
import CeoTestimonials from '../libs/components/home/CeoTestimonials';
import Footer from '../libs/components/layout/Footer';
import { CategoryId } from '../libs/types';

// Dynamically import components that use framer-motion (client-side only)
const Hero = dynamic(() => import('../libs/components/home/Hero'), { ssr: false });
const AnimatedBackground = dynamic(() => import('../libs/components/home/AnimatedBackground'), { ssr: false });

export default function Home() {
  // ========== HOOKS & STATE ==========
  const router = useRouter();

  // Logged-in users may browse the marketing home (e.g. "Go to Home" from dashboard); use Navbar → Dashboard to return.

  // ========== HANDLERS ==========
  const handleGetStarted = () => {
    router.push('/marketplace');
  };

  const handleBrowseCategory = (categoryId: CategoryId) => {
    router.push(`/marketplace?category=${categoryId}`);
  };

  // ========== RENDER ==========
  return (
    <div className="app-container relative min-h-screen">
      <AnimatedBackground />
      <main className="main-content relative z-10">
        <Hero 
          onGetStarted={handleGetStarted} 
          onWantToHire={() => router.push('/signup?role=buyer')}
          onWantToWork={() => router.push('/signup?role=provider')}
        />
        <HowItWorks />
        <TopCategories onBrowse={handleBrowseCategory} />
        <CeoTestimonials />
        <HomePremiumInteractive />
      </main>
      <div className="relative z-10">
        <Footer />
      </div>
    </div>
  );
}
