
import React, { useState } from 'react';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 glass shadow-sm">
      <nav className="container mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-[#002D62] rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xl serif">A</span>
          </div>
          <span className="text-[#002D62] font-bold text-lg hidden sm:block serif">Albertus Magnus</span>
        </div>

        <div className="hidden md:flex items-center space-x-8 text-[#002D62] font-medium">
          <a href="#" className="hover:text-[#FFC72C] transition-colors">Home</a>
          <a href="#programs" className="hover:text-[#FFC72C] transition-colors">Programs</a>
          <a href="#campus" className="hover:text-[#FFC72C] transition-colors">Campus</a>
          <a href="#creative" className="hover:text-[#FFC72C] transition-colors">AI Studio</a>
          <button className="bg-[#002D62] text-white px-5 py-2 rounded-full text-sm font-semibold hover:bg-opacity-90 transition-all">
            Apply Now
          </button>
        </div>

        <button 
          className="md:hidden text-[#002D62]"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
          </svg>
        </button>
      </nav>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t py-4 px-6 flex flex-col space-y-4 shadow-lg animate-in slide-in-from-top duration-300">
          <a href="#" className="text-[#002D62] font-medium py-2">Home</a>
          <a href="#programs" className="text-[#002D62] font-medium py-2">Programs</a>
          <a href="#campus" className="text-[#002D62] font-medium py-2">Campus</a>
          <a href="#creative" className="text-[#002D62] font-medium py-2">AI Studio</a>
          <button className="bg-[#002D62] text-white px-5 py-3 rounded-lg font-semibold w-full">
            Apply Now
          </button>
        </div>
      )}
    </header>
  );
};

export default Header;
