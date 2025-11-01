import React from 'react';
import {
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  ArrowUp,
} from 'lucide-react';

function Footer() {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <footer className="bg-[#FDF8F3] text-[#292929] border-t border-[#E1D5C9] pt-12 pb-6 px-[5vw] font-sans text-sm">
      {/* Main Sections */}
      <div className="flex flex-col md:flex-row justify-between gap-12 mb-10">
        {/* Contact Info */}
        <div className="min-w-[200px]">
          <h4 className="text-[1.1rem] font-semibold mb-3 tracking-wide">Get in Touch</h4>
          <p className="text-[#555] leading-relaxed">
            📧 support@sklpss.org<br />
            📞 +248 2610899
          </p>
        </div>

        {/* Useful Links */}
        <div className="min-w-[200px]">
          <h4 className="text-[1.1rem] font-semibold mb-3 tracking-wide">Useful Links</h4>
          <ul className="space-y-1 text-[#555]">
            <li><a href="/" className="hover:text-[#F48F0F] transition">Home</a></li>
            <li><a href="/AboutUs" className="hover:text-[#F48F0F] transition">About Us</a></li>
            <li><a href="/Education" className="hover:text-[#F48F0F] transition">Education</a></li>
            
          </ul>
        </div>

        {/* Newsletter */}
        <div className="min-w-[250px]">
          {/* <h4 className="text-[1.1rem] font-semibold mb-3 tracking-wide">Subscribe to our newsletter</h4>
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full p-2 border border-gray-300 rounded-md text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-[#F48F0F]"
          />
          <div className="flex items-start mb-3">
            <input type="checkbox" id="agree" className="mt-1 mr-2 accent-[#F48F0F]" />
            <label htmlFor="agree" className="text-[#555] leading-snug">
              I agree to receive newsletters
            </label>
          </div>
          <button className="bg-[#F48F0F] text-[#292929] py-2 px-5 rounded-full font-semibold hover:brightness-110 transition">
            Subscribe
          </button> */}
        </div>
      </div>

      {/* Socials & Scroll */}
      <div className="flex flex-col md:flex-row items-center justify-between border-t border-[#e4d8cd] pt-6 gap-4">
        {/* Social Icons */}
        <div className="flex gap-4 text-[#292929] text-lg">
          <a href="#" className="hover:text-[#F48F0F] transition" aria-label="Facebook"><Facebook size={18} /></a>
          <a href="#" className="hover:text-[#F48F0F] transition" aria-label="Instagram"><Instagram size={18} /></a>
          <a href="#" className="hover:text-[#F48F0F] transition" aria-label="Twitter"><Twitter size={18} /></a>
          <a href="#" className="hover:text-[#F48F0F] transition" aria-label="LinkedIn"><Linkedin size={18} /></a>
        </div>

        {/* Scroll to top */}
        <button
          onClick={scrollToTop}
          className="flex items-center gap-2 text-xs text-[#444] hover:text-[#F48F0F] transition"
        >
          <ArrowUp size={14} /> Back to Top
        </button>
      </div>

      {/* Copyright */}
      <div className="text-center text-xs text-[#777] mt-4 tracking-wide">
        © {new Date().getFullYear()} SKLPSS Name. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;
