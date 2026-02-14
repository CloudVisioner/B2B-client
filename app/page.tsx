'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import HowItWorks from '../components/HowItWorks';
import TopCategories from '../components/TopCategories';
import TestimonialSection from '../components/TestimonialSection';
import Footer from '../components/Footer';
import Marketplace from '../components/Marketplace';
import ProvidersPage from '../components/ProvidersPage';
import ProviderProfile from '../components/ProviderProfile';
import { CategoryId, PageId } from '../types';

export default function Home() {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState<PageId>('home');
  const [selectedCategory, setSelectedCategory] = useState<CategoryId>('it-software');
  const [selectedProviderId, setSelectedProviderId] = useState<number | null>(null);

  const navigateTo = (page: PageId, categoryId?: CategoryId, providerId?: number) => {
    if (categoryId) setSelectedCategory(categoryId);
    if (providerId) setSelectedProviderId(providerId);
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'marketplace':
        return <Marketplace initialCategory={selectedCategory} onSelectProvider={(id) => navigateTo('provider-profile', undefined, id)} />;
      case 'providers':
        return <ProvidersPage onSelectProvider={(id) => navigateTo('provider-profile', undefined, id)} />;
      case 'provider-profile':
        return <ProviderProfile providerId={selectedProviderId} onBrowseServices={() => navigateTo('marketplace')} />;
      default:
        return (
          <>
            <Hero 
              onGetStarted={() => navigateTo('marketplace')} 
              onWantToHire={() => router.push('/signup?role=buyer')}
              onWantToWork={() => router.push('/signup?role=provider')}
            />
            <HowItWorks />
            <TopCategories onBrowse={(id) => navigateTo('marketplace', id)} />
            <TestimonialSection />
          </>
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <Navbar onNavigate={(page) => navigateTo(page)} currentPage={currentPage} />
      <main className="flex-grow pt-20">
        {renderPage()}
      </main>
      <Footer />
    </div>
  );
}
