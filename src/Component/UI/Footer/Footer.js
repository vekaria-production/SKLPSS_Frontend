import React from 'react';
import {
  Facebook,
  Instagram,
  ArrowUp,
} from 'lucide-react';

function Footer() {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <footer className="bg-[#FDF8F3] text-[#292929] border-t border-[#E1D5C9] pt-16 pb-8 px-6 sm:px-12 font-sans text-sm">
      <div className="max-w-7xl mx-auto">
        {/* Main Columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 mb-12 text-center sm:text-left">
          {/* Contact Info & Tagline */}
          <div className="flex flex-col items-center sm:items-start">
            <h4 className="text-[1.1rem] font-bold mb-4 tracking-wide text-gray-900">Get in Touch</h4>
            <p className="text-[#555] leading-relaxed space-y-1 text-sm font-medium">
              <span className="block">📧 support@sklpss.org</span>
              <span className="block">📞 +248 2610899</span>
            </p>
            <p className="text-[#666] text-xs leading-relaxed max-w-xs italic border-l-2 border-[#F48F0F] pl-3 mt-4 text-left">
              "Preserving Gujarati culture, fostering community unity, and serving Seychelles with pride."
            </p>
          </div>

          {/* Useful Links */}
          <div className="flex flex-col items-center sm:items-start">
            <h4 className="text-[1.1rem] font-bold mb-4 tracking-wide text-gray-900">Useful Links</h4>
            <ul className="space-y-2.5 text-sm font-medium text-[#555]">
              <li><a href="/" className="hover:text-[#F48F0F] transition duration-200">Home</a></li>
              <li><a href="/AboutUs" className="hover:text-[#F48F0F] transition duration-200">About Us</a></li>
              <li><a href="/Education" className="hover:text-[#F48F0F] transition duration-200">Education</a></li>
              <li><a href="/Membership" className="hover:text-[#F48F0F] transition duration-200">Membership</a></li>
            </ul>
          </div>

          {/* Samaj Info Column */}
          <div className="flex flex-col items-center sm:items-start sm:col-span-2 md:col-span-1 justify-center mt-6 md:mt-0">
            <p className="text-gray-400 text-xs italic tracking-wider uppercase font-semibold text-center sm:text-left">
              Shree Kutchi Leva Patel Samaj Seychelles
            </p>
          </div>
        </div>

        {/* Socials & Scroll to Top Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between border-t border-[#e4d8cd] pt-6 gap-6">
          {/* Social Icons */}
          <div className="flex gap-4 text-[#292929]">
            <a href="https://www.facebook.com/SKLPSS/" target="_blank" rel="noopener noreferrer" className="hover:text-[#F48F0F] transition duration-200 bg-white border border-[#E1D5C9] p-2.5 rounded-full hover:shadow shadow-sm flex items-center justify-center cursor-pointer" aria-label="Facebook"><Facebook size={18} /></a>
            <a href="https://www.instagram.com/sklps_seychelles/" target="_blank" rel="noopener noreferrer" className="hover:text-[#F48F0F] transition duration-200 bg-white border border-[#E1D5C9] p-2.5 rounded-full hover:shadow shadow-sm flex items-center justify-center cursor-pointer" aria-label="Instagram"><Instagram size={18} /></a>
          </div>

          {/* Scroll to top */}
          <button
            onClick={scrollToTop}
            className="flex items-center gap-2 text-xs text-[#444] hover:text-[#F48F0F] transition duration-200 font-semibold cursor-pointer border border-[#E1D5C9] bg-white hover:bg-orange-50/30 px-4 py-2 rounded-full shadow-sm hover:shadow"
          >
            <ArrowUp size={14} /> Back to Top
          </button>
        </div>

        {/* Copyright */}
        <div className="text-center text-xs text-[#777] mt-8 pt-4 border-t border-gray-200/40 tracking-wide font-medium">
          © {new Date().getFullYear()} SKLPSS Seychelles. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

export default Footer;
