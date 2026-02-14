import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  CheckCircle, ArrowRight, Star, 
  Lock, Clock, Zap, Users, MapPin, DollarSign
} from 'lucide-react';
import { ALL_PROVIDERS } from './Marketplace';
import { Provider } from '../types';

interface ProviderProfileProps {
  providerId: number | null;
  onBrowseServices: () => void;
}

const ProviderProfile: React.FC<ProviderProfileProps> = ({ providerId, onBrowseServices }) => {
  const router = useRouter();
  const [isLoggedIn] = useState(false);
  const provider = ALL_PROVIDERS.find(p => p.id === providerId) || ALL_PROVIDERS[0];
  
  // Extended provider data with essential info only
  const providerData = {
    ...provider,
    establishmentYear: 2015,
    teamSize: 45,
    industries: ['Technology', 'Finance', 'Healthcare', 'Retail', 'Manufacturing'],
    minProjectSize: 5000
  };

  return (
    <div className="bg-slate-50 min-h-screen overflow-x-hidden">
      {/* Profile Header */}
      <div className="bg-white border-b border-slate-100 pt-12 pb-12">
        <div className="max-w-6xl mx-auto px-4">
          {/* Logo, Name, Tagline, and Action Buttons */}
          <div className="flex flex-col md:flex-row items-start md:items-center gap-8 mb-10">
            <div className="relative shrink-0">
              <img 
                src={providerData.avatar} 
                alt={providerData.name} 
                className="w-28 h-28 rounded-3xl object-cover border-4 border-white shadow-xl"
              />
              {providerData.badges.includes("VERIFIED") && (
                <div className="absolute -top-2 -right-2 bg-indigo-600 text-white p-2 rounded-xl border-4 border-white shadow-xl">
                  <CheckCircle className="w-5 h-5" />
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-3">
                <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">{providerData.name}</h1>
                {providerData.badges.includes("VERIFIED") && (
                  <span className="px-3 py-1.5 bg-indigo-600 text-white text-sm font-bold rounded-lg">
                    ✓ VERIFIED
                  </span>
                )}
              </div>
              <p className="text-slate-500 font-medium text-lg">{providerData.description}</p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
              {isLoggedIn ? (
                <>
                  <button className="px-8 py-3.5 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white font-bold rounded-xl shadow-xl shadow-indigo-500/30 hover:shadow-2xl hover:shadow-indigo-500/40 transition-all whitespace-nowrap">
                    Request Quote
                  </button>
                  <button className="px-8 py-3.5 border-2 border-slate-300 text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition-all whitespace-nowrap">
                    Book Consultation
                  </button>
                </>
              ) : (
                <button 
                  onClick={() => router.push('/signup?role=buyer')}
                  className="px-8 py-3.5 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white font-bold rounded-xl shadow-xl shadow-indigo-500/30 hover:shadow-2xl hover:shadow-indigo-500/40 transition-all whitespace-nowrap"
                >
                  Sign Up to Contact
                </button>
              )}
            </div>
          </div>

          {/* Premium About, Performance Metrics, Location Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* About Section - Premium Card */}
            <div className="group relative bg-white rounded-2xl p-8 border border-slate-200 shadow-lg hover:shadow-2xl transition-all overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full blur-3xl opacity-50 group-hover:opacity-70 transition-opacity"></div>
              <div className="relative">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center shadow-lg">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">About</h3>
                </div>
                <p className="text-sm text-slate-700 leading-relaxed mb-6 font-medium">{providerData.bio}</p>
                <div className="pt-6 border-t border-slate-100 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-500 font-medium">Established</span>
                    <span className="text-base font-bold text-slate-900">{providerData.establishmentYear}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-500 font-medium">Team Size</span>
                    <div className="flex items-center gap-2">
                      <Users className="w-5 h-5 text-indigo-600" />
                      <span className="text-base font-bold text-slate-900">{providerData.teamSize} experts</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Performance Metrics - Premium Card */}
            <div className="group relative bg-white rounded-2xl p-8 border border-slate-200 shadow-lg hover:shadow-2xl transition-all overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-full blur-3xl opacity-50 group-hover:opacity-70 transition-opacity"></div>
              <div className="relative">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-lg">
                    <Star className="w-6 h-6 text-white fill-white" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Performance</h3>
                </div>
                <div className="space-y-5">
                  <div>
                    <div className="flex items-baseline gap-2 mb-1">
                      <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                      <span className="text-2xl font-extrabold text-slate-900">{providerData.rating}</span>
                      <span className="text-sm text-slate-500 font-medium">/ 5.0</span>
                    </div>
                    <p className="text-sm text-slate-500 font-medium">{providerData.reviewsCount} verified reviews</p>
                  </div>
                  <div className="pt-4 border-t border-slate-100 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Clock className="w-5 h-5 text-slate-400" />
                        <span className="text-sm text-slate-500 font-medium">Response</span>
                      </div>
                      <span className="text-base font-bold text-slate-900">{providerData.responseTime}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-5 h-5 text-slate-400" />
                        <span className="text-sm text-slate-500 font-medium">Starting Rate</span>
                      </div>
                      <span className="text-base font-bold text-slate-900">${providerData.startingRate}/hr</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Location - Premium Card */}
            <div className="group relative bg-white rounded-2xl p-8 border border-slate-200 shadow-lg hover:shadow-2xl transition-all overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-full blur-3xl opacity-50 group-hover:opacity-70 transition-opacity"></div>
              <div className="relative">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Location</h3>
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="text-lg font-bold text-slate-900 mb-1">{providerData.city}</p>
                    <p className="text-sm text-slate-600 font-medium">{providerData.location}</p>
                  </div>
                  <div className="pt-4 border-t border-slate-100">
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                      <span className="font-medium">Global Reach</span>
                      <span className="text-slate-300">•</span>
                      <span>Remote Available</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Body - Centered */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="space-y-12">
          {/* Portfolio - Case Studies (Restricted for guests) */}
          <section className="relative">
            {!isLoggedIn && (
              <div className="absolute inset-0 bg-white/95 backdrop-blur-md rounded-3xl z-10 flex flex-col items-center justify-center p-12 border-2 border-dashed border-slate-300 shadow-2xl">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center mb-6">
                  <Lock className="w-8 h-8 text-indigo-600" />
                </div>
                <h3 className="text-2xl font-extrabold text-slate-900 mb-3">Sign Up to View Portfolio</h3>
                <p className="text-slate-600 text-sm text-center max-w-sm mb-8 leading-relaxed">
                  Create an account to view detailed case studies and client portfolios.
                </p>
                <button 
                  onClick={() => router.push('/signup?role=buyer')}
                  className="px-8 py-3.5 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white font-bold rounded-xl shadow-xl shadow-indigo-500/30 hover:shadow-2xl hover:shadow-indigo-500/40 transition-all transform hover:-translate-y-0.5"
                >
                  Sign Up
                </button>
              </div>
            )}

            <div className={`bg-white rounded-3xl p-12 border-2 border-dashed border-slate-300 ${!isLoggedIn ? 'blur-sm pointer-events-none' : ''}`}>
              <div className="text-center">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center mx-auto mb-6">
                  <Zap className="w-8 h-8 text-indigo-600" />
                </div>
                <h3 className="text-2xl font-extrabold text-slate-900 mb-3">Portfolio</h3>
                <p className="text-slate-600 text-sm mb-8">Case studies and client portfolios will appear here</p>
              </div>
            </div>
          </section>

          {/* Industries Served and Contact Info - Side by Side */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Industries Served */}
            <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-lg">
              <h4 className="font-bold text-slate-900 mb-6 text-lg">Industries Served</h4>
              <div className="flex flex-wrap gap-3">
                {providerData.industries.map((industry, idx) => (
                  <span key={idx} className="px-4 py-2 bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 text-sm font-semibold rounded-lg border border-indigo-200 shadow-sm hover:shadow-md transition-all">
                    {industry}
                  </span>
                ))}
              </div>
            </div>

            {/* Contact Info (only for logged-in users) */}
            {isLoggedIn ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-lg">
                <h4 className="font-bold text-slate-900 mb-6 text-lg">Contact Information</h4>
                <div className="space-y-4 text-sm text-slate-600">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-indigo-600" />
                    </div>
                    <span className="font-medium">{providerData.city}, {providerData.location}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center">
                      <Clock className="w-5 h-5 text-indigo-600" />
                    </div>
                    <span className="font-medium">Response: {providerData.responseTime}</span>
                  </div>
                  <div className="pt-4 border-t border-slate-100">
                    <p className="text-sm text-slate-500 mb-4">Email and phone available to verified clients</p>
                    <button className="w-full px-4 py-3 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white text-base font-semibold rounded-lg hover:shadow-lg transition-all">
                      Get Contact Details
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl border-2 border-dashed border-slate-300 p-8 text-center shadow-lg">
                <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center mx-auto mb-4 shadow-md">
                  <Lock className="w-8 h-8 text-indigo-600" />
                </div>
                <h4 className="font-bold text-slate-900 mb-2 text-lg">Contact Information</h4>
                <p className="text-sm text-slate-600 mb-6">Sign up to view contact details and request quotes</p>
                <button 
                  onClick={() => router.push('/signup?role=buyer')}
                  className="w-full px-4 py-3 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white text-sm font-semibold rounded-lg hover:shadow-lg transition-all"
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* CTA Footer Section */}
      <div className="bg-slate-900 py-24 px-4 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/10 blur-[100px] rounded-full"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
           <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-6 leading-tight">
             Ready to collaborate with {provider.name}?
           </h2>
           <p className="text-slate-400 text-lg mb-10 max-w-2xl mx-auto font-medium">
             Start a conversation today to explore how our expertise can drive your business goals.
           </p>
           <button 
             onClick={onBrowseServices}
             className="px-10 py-5 bg-indigo-600 text-white font-black rounded-2xl shadow-2xl shadow-indigo-500/20 hover:scale-105 transition-all"
           >
             Browse Services
           </button>
        </div>
      </div>
    </div>
  );
};

export default ProviderProfile;