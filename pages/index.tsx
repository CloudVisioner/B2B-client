import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../apollo/store';
import { isLoggedIn } from '../libs/auth';
import Navbar from '../libs/components/Navbar';
import Hero from '../libs/components/Hero';
import HowItWorks from '../libs/components/HowItWorks';
import TopCategories from '../libs/components/TopCategories';
import TestimonialSection from '../libs/components/TestimonialSection';
import Footer from '../libs/components/Footer';
import { CategoryId } from '../libs/types';

export default function Home() {
  const router = useRouter();
  const currentUser = useReactiveVar(userVar);

  // Redirect logged-in users to their dashboard
  useEffect(() => {
    if (isLoggedIn() && currentUser?.userRole) {
      const role = currentUser.userRole;
      if (role === 'PROVIDER' || role === 'provider') {
        router.push('/provider/dashboard');
      } else {
        router.push('/dashboard');
      }
    }
  }, [router, currentUser]);

  const handleGetStarted = () => {
    router.push('/marketplace');
  };

  const handleBrowseCategory = (categoryId: CategoryId) => {
    router.push(`/marketplace?category=${categoryId}`);
  };

  return (
    <div className="app-container">
      <Navbar currentPage="home" />
      <main className="main-content">
        <Hero 
          onGetStarted={handleGetStarted} 
          onWantToHire={() => router.push('/signup?role=buyer')}
          onWantToWork={() => router.push('/signup?role=provider')}
        />
        <HowItWorks />
        <TopCategories onBrowse={handleBrowseCategory} />
        <TestimonialSection />
      </main>
      <Footer />
    </div>
  );
}
