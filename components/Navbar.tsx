import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTheme } from '../styles/ThemeContext';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { isDarkMode, toggleMode } = useTheme();

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      document.body.classList.toggle('dark-mode', savedTheme === 'dark');
    }
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleMenuToggle = () => setIsMenuOpen(!isMenuOpen);

  const linkClass = `relative font-medium pb-1 transition-colors after:absolute after:left-0 after:bottom-0 after:h-0.5 after:w-0 after:rounded-full after:bg-current after:transition-all after:duration-300 hover:after:w-full ${
    isDarkMode ? 'text-[#D7B66A]' : 'text-[#7D0A0A]'
  }`;

  return (
    <header
      className={`sticky top-0 z-50 w-full flex justify-between items-center px-4 sm:px-6 h-20 transition-all duration-300 ${
        scrolled
          ? isDarkMode
            ? 'bg-[#0D0D0D]/80 backdrop-blur-md shadow-lg shadow-black/40 text-[#D7B66A]'
            : 'bg-white/80 backdrop-blur-md shadow-md text-black'
          : isDarkMode
            ? 'bg-[#0D0D0D] text-[#D7B66A]'
            : 'bg-white text-black'
      }`}
    >
      <div className="flex-1 pl-2">
        <Link href="/" passHref>
          <Image
            src="/logo.png"
            alt="Boostify Logo"
            className="h-[50px] transition-transform duration-300 hover:scale-105"
            width={125}
            height={50}
          />
        </Link>
      </div>

      <nav className="flex items-center gap-4">
        <button onClick={toggleMode} className="cursor-pointer">
          <Image
            src={isDarkMode ? '/light-mode-icon.png' : '/moon.png'}
            alt={isDarkMode ? 'Light Mode Icon' : 'Dark Mode Icon'}
            width={35}
            height={24}
            className="transition-transform duration-300 hover:rotate-12"
          />
        </button>

        {/* Hamburger Menu for small screens */}
        <button className="flex flex-col justify-center items-center space-y-1 md:hidden" onClick={handleMenuToggle}>
          <span className="block w-6 h-0.5 bg-gray-400"></span>
          <span className="block w-6 h-0.5 bg-gray-400"></span>
          <span className="block w-6 h-0.5 bg-gray-400"></span>
        </button>

        {/* Navbar Links */}
        <ul
          className={`md:flex items-center gap-6 ml-0 ${isMenuOpen ? 'flex flex-col mt-4 md:mt-0' : 'hidden'} absolute md:static top-20 left-0 right-0 ${
            isDarkMode ? 'bg-[#0D0D0D]' : 'bg-white'
          } md:bg-transparent shadow-md md:shadow-none rounded-md md:rounded-none p-4 md:p-0 z-50`}
        >
          <li><Link href="/About" className={linkClass}>About</Link></li>
          <li><Link href="/Team" className={linkClass}>Our Team</Link></li>
          <li>
            <Link
              href="/SignIn"
              className={`relative font-bold pb-1 transition-colors after:absolute after:left-0 after:bottom-0 after:h-0.5 after:w-0 after:rounded-full after:bg-current after:transition-all after:duration-300 hover:after:w-full ${
                isDarkMode ? 'text-[#EAD196]' : 'text-[#b91c1c]'
              }`}
            >
              Sign In
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Navbar;