import React from 'react';
import { useRouter } from 'next/router';
import Navbar from '../libs/components/Navbar';
import ProvidersPage from '../libs/components/ProvidersPage';
import Footer from '../libs/components/Footer';

export default function ProvidersPageRoute() {
  const router = useRouter();

  const handleSelectProvider = (id: string) => {
    router.push(`/provider/${id}`);
  };

  return (
    <div className="app-container">
      <Navbar currentPage="providers" />
      <main className="main-content">
        <ProvidersPage onSelectProvider={handleSelectProvider} />
      </main>
      <Footer />
    </div>
  );
}
