
import React from 'react';
import { Facebook, Twitter, Linkedin, ShieldCheck, CheckCircle2 } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="pt-24 pb-8 bg-white border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-12 mb-20">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <span className="text-2xl font-bold tracking-tight">
                <span className="text-indigo-600">SME</span>Connect
              </span>
            </div>
            <p className="text-slate-500 text-base max-w-xs mb-8 leading-relaxed">
              The premium gateway for enterprises to access world-class technical expertise and specialized managed services.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-slate-400 hover:text-indigo-600 transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="text-slate-400 hover:text-indigo-600 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 mb-6 uppercase tracking-wider text-xs">Marketplace</h4>
            <ul className="space-y-4 text-base text-slate-500">
              <li><a href="#" className="hover:text-indigo-600 transition-colors">IT Support</a></li>
              <li><a href="#" className="hover:text-indigo-600 transition-colors">Cloud Services</a></li>
              <li><a href="#" className="hover:text-indigo-600 transition-colors">Cybersecurity</a></li>
              <li><a href="#" className="hover:text-indigo-600 transition-colors">Development</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 mb-6 uppercase tracking-wider text-xs">Company</h4>
            <ul className="space-y-4 text-base text-slate-500">
              <li><a href="#" className="hover:text-indigo-600 transition-colors">Our Ethos</a></li>
              <li><a href="#" className="hover:text-indigo-600 transition-colors">Sustainability</a></li>
              <li><a href="#" className="hover:text-indigo-600 transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-indigo-600 transition-colors">Press</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 mb-6 uppercase tracking-wider text-xs">Legal</h4>
            <ul className="space-y-4 text-base text-slate-500">
              <li><a href="#" className="hover:text-indigo-600 transition-colors">Privacy</a></li>
              <li><a href="#" className="hover:text-indigo-600 transition-colors">Security</a></li>
              <li><a href="#" className="hover:text-indigo-600 transition-colors">Terms</a></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-50 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-400 text-xs font-medium uppercase tracking-widest">
            © 2024 SME CONNECT MARKETPLACE. ALL INTELLECTUAL PROPERTY RESERVED.
          </p>
          <div className="flex gap-6 items-center">
            <div className="flex items-center gap-1.5 text-slate-400 text-xs font-bold uppercase tracking-widest">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> SYSTEM STATUS: OPTIMAL
            </div>
            <div className="text-slate-400 text-xs font-bold uppercase tracking-widest">
              ISO 27001 CERTIFIED
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
