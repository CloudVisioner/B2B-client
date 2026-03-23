import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import ProviderProfile from '../../libs/components/ProviderProfile';
import Footer from '../../libs/components/Footer';

export default function ProviderDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const [providerId, setProviderId] = useState<string | null>(null);

  useEffect(() => {
    if (id && typeof id === 'string') {
      setProviderId(id);
    }
  }, [id]);

  const handleBrowseServices = () => {
    // Preserve category filter if coming from marketplace
    const category = router.query.fromCategory;
    if (category) {
      router.push(`/marketplace?category=${category}`);
    } else {
      router.push('/marketplace');
    }
  };

  const handleSelectProvider = (id: string) => {
    // Preserve current category context when navigating to another provider
    const category = router.query.fromCategory;
    if (category) {
      router.push(`/provider/${id}?fromCategory=${category}`);
    } else {
      router.push(`/provider/${id}`);
    }
  };

  return (
    <div className="app-container">
      <main className="main-content">
        <ProviderProfile 
          providerId={providerId} 
          onBrowseServices={handleBrowseServices} 
          onSelectProvider={handleSelectProvider}
        />
      </main>
      <Footer />
    </div>
  );
}
