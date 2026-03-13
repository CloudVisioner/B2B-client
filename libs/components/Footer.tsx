
import React from 'react';
import { Facebook, Twitter, Linkedin, ShieldCheck, CheckCircle2 } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="pt-24 pb-8 bg-transparent border-t border-black/5 dark:border-white/10 transition-colors" style={{ fontFamily: 'Inter, sans-serif' }}>
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-12 mb-20">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <span className="text-2xl font-black tracking-tight" style={{ fontFamily: 'Inter, sans-serif' }}>
                <span className="text-indigo-600 dark:text-indigo-400">SME</span>
                <span className="text-slate-900 dark:text-white">Connect</span>
              </span>
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-base max-w-xs mb-8 leading-relaxed font-medium" style={{ fontFamily: 'Inter, sans-serif' }}>
              The premium gateway for enterprises to access world-class technical expertise and specialized managed services.
            </p>
            <div className="flex gap-4">
              <div className="text-slate-400 dark:text-slate-500 cursor-default">
                <Linkedin className="w-5 h-5" />
              </div>
              <div className="text-slate-400 dark:text-slate-500 cursor-default">
                <Twitter className="w-5 h-5" />
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-black text-slate-900 dark:text-white mb-6 uppercase tracking-wider text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>Marketplace</h4>
            <ul className="space-y-4 text-base text-slate-500 dark:text-slate-400 font-medium" style={{ fontFamily: 'Inter, sans-serif' }}>
              <li className="cursor-default">IT Support</li>
              <li className="cursor-default">Cloud Services</li>
              <li className="cursor-default">Cybersecurity</li>
              <li className="cursor-default">Development</li>
            </ul>
          </div>

          <div>
            <h4 className="font-black text-slate-900 dark:text-white mb-6 uppercase tracking-wider text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>Company</h4>
            <ul className="space-y-4 text-base text-slate-500 dark:text-slate-400 font-medium" style={{ fontFamily: 'Inter, sans-serif' }}>
              <li className="cursor-default">Our Ethos</li>
              <li className="cursor-default">Sustainability</li>
              <li className="cursor-default">Careers</li>
              <li className="cursor-default">Press</li>
            </ul>
          </div>

          <div>
            <h4 className="font-black text-slate-900 dark:text-white mb-6 uppercase tracking-wider text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>Legal</h4>
            <ul className="space-y-4 text-base text-slate-500 dark:text-slate-400 font-medium" style={{ fontFamily: 'Inter, sans-serif' }}>
              <li className="cursor-default">Privacy</li>
              <li className="cursor-default">Security</li>
              <li className="cursor-default">Terms</li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-200 dark:border-slate-700 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-400 dark:text-slate-500 text-xs font-bold uppercase tracking-widest" style={{ fontFamily: 'Inter, sans-serif' }}>
            © 2024 SME CONNECT MARKETPLACE. ALL INTELLECTUAL PROPERTY RESERVED.
          </p>
          <div className="flex gap-6 items-center">
            <div className="flex items-center gap-1.5 text-slate-400 dark:text-slate-500 text-xs font-black uppercase tracking-widest" style={{ fontFamily: 'Inter, sans-serif' }}>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> SYSTEM STATUS: OPTIMAL
            </div>
            <div className="text-slate-400 dark:text-slate-500 text-xs font-black uppercase tracking-widest" style={{ fontFamily: 'Inter, sans-serif' }}>
              ISO 27001 CERTIFIED
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
