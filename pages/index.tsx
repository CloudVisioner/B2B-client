import React, { useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../apollo/store';
import { isLoggedIn } from '../libs/auth';
import HowItWorks from '../libs/components/HowItWorks';
import TopCategories from '../libs/components/TopCategories';
import TestimonialSection from '../libs/components/TestimonialSection';
import Footer from '../libs/components/Footer';
import { CategoryId } from '../libs/types';

// Dynamically import components that use framer-motion (client-side only)
const Navbar = dynamic(() => import('../libs/components/Navbar'), { ssr: false });
const Hero = dynamic(() => import('../libs/components/Hero'), { ssr: false });
const AnimatedBackground = dynamic(() => import('../libs/components/AnimatedBackground'), { ssr: false });

export default function Home() {
  // ========== HOOKS & STATE ==========
  const router = useRouter();
  const currentUser = useReactiveVar(userVar);

  // ========== LIFECYCLES ==========
  useEffect(() => {
    if (isLoggedIn() && currentUser?.userRole) {
      const role = currentUser.userRole;
      if (role === 'PROVIDER' || role === 'provider') {
        router.push('/provider/dashboard');
      } else {
        router.push('/dashboard');
      }
    }
  }, [router, currentUser?.userRole]);

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
      <Navbar currentPage="home" />
      <main className="main-content relative z-10">
        <Hero 
          onGetStarted={handleGetStarted} 
          onWantToHire={() => router.push('/signup?role=buyer')}
          onWantToWork={() => router.push('/signup?role=provider')}
        />
        <HowItWorks />
        <TopCategories onBrowse={handleBrowseCategory} />
        <TestimonialSection />
      </main>
      <div className="relative z-10">
        <Footer />
      </div>
    </div>
  );
}
