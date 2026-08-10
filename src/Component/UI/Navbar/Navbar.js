import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import logo from "../../../assets/logo.png";
import { Menu, X } from "lucide-react";

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <header className="bg-[#FDF8F3] border-b border-[#E1D5C9] font-sans sticky top-0 z-40 backdrop-blur-md bg-opacity-95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/">
              <img
                src={logo}
                alt="SKLPSS Logo"
                className="h-14 w-auto cursor-pointer"
              />
            </Link>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex space-x-8 text-sm font-semibold tracking-wide">
            {[
              { label: "Home", path: "/" },
              { label: "About", path: "/aboutUs" },
              { label: "Gallery", path: "/Gallery" },
              { label: "Education", path: "/Education" }
            ].map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`transition-all duration-200 hover:text-[#F48F0F] relative py-1 ${
                  location.pathname === item.path
                    ? "text-[#F48F0F] font-bold after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-[#F48F0F]"
                    : "text-[#292929]"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Desktop Membership CTA */}
          {/* <div className="hidden md:block">
            <button
              onClick={() => navigate("/Membership")}
              className="bg-[#F48F0F] hover:bg-[#e1810c] text-white font-bold px-6 py-2.5 rounded-full text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer"
            >
              Become a member
            </button>
          </div> */}

          {/* Mobile Menu Toggle */}
          <div className="flex md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-xl text-gray-700 hover:text-[#F48F0F] hover:bg-orange-50 focus:outline-none transition cursor-pointer"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      <div
        className={`md:hidden transition-all duration-300 ease-in-out ${
          isMenuOpen ? "max-h-[350px] opacity-100 border-t border-orange-100" : "max-h-0 opacity-0 overflow-hidden"
        }`}
      >
        <div className="px-4 pt-3 pb-6 space-y-2 bg-[#FDF8F3] shadow-inner text-center">
          {[
            { label: "Home", path: "/" },
            { label: "About", path: "/aboutUs" },
            { label: "Gallery", path: "/Gallery" },
            { label: "Education", path: "/Education" }
          ].map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setIsMenuOpen(false)}
              className={`block px-4 py-2.5 rounded-xl text-base font-semibold transition-all ${
                location.pathname === item.path
                  ? "bg-orange-50 text-[#F48F0F]"
                  : "text-gray-700 hover:bg-orange-50/50 hover:text-[#F48F0F]"
              }`}
            >
              {item.label}
            </Link>
          ))}
          {/* <div className="pt-4 border-t border-orange-100/50">
            <button
              onClick={() => {
                setIsMenuOpen(false);
                navigate("/Membership");
              }}
              className="bg-[#F48F0F] hover:bg-[#e1810c] text-white font-bold w-full py-3 rounded-full text-sm uppercase tracking-wider shadow transition duration-300 cursor-pointer"
            >
              Become a member
            </button>
          </div> */}
        </div>
      </div>
    </header>
  );
}

export default Navbar;
