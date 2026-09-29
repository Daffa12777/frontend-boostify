import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';
import { useTheme } from '../styles/ThemeContext';
import SignOut from './SignOut/SignOut';
import { signOut } from 'next-auth/react';

const HomeNav: React.FC = () => {
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [userName, setUserName] = useState<string | null>(null);
  const [assistantCode, setAssistantCode] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const router = useRouter();
  const { isDarkMode, toggleMode } = useTheme();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      const authDataString = localStorage.getItem('authData');
      if (authDataString) {
        const authData = JSON.parse(authDataString);
        const token = authData.token.token;
        if (token) {
          try {
            const response = await fetch('https://boostify-back-end.vercel.app/api/whoami', {
              method: 'GET',
              headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
            });
            if (!response.ok) {
              if (response.status === 401) {
                localStorage.removeItem('authData');
                router.push('/SignIn');
              } else {
                throw new Error(await response.text());
              }
            }
            const data = await response.json();
            setUserName(data.name);
            setAssistantCode(data.assisstant_code);
          } catch (error) {
            console.error('Failed to fetch user data:', error);
          }
        }
      }
    };
    fetchUserData();
  }, [router]);

  const handleSignOut = async () => {
    try {
      localStorage.removeItem('authData');
      localStorage.removeItem('nextauth.message');
      await signOut({ callbackUrl: '/' });
    } catch (error) {
      console.error('Sign out failed:', error);
    } finally {
      setShowPopup(false);
    }
  };

  const handleMenuToggle = () => setIsMenuOpen(!isMenuOpen);

  const linkClass = `relative font-medium pb-1 transition-colors after:absolute after:left-0 after:bottom-0 after:h-0.5 after:w-0 after:rounded-full after:bg-current after:transition-all after:duration-300 hover:after:w-full ${isDarkMode ? 'text-[#EAD196]' : 'text-red-700'}`;

  return (
    <>
      <header
        className={`sticky top-0 z-50 w-full flex justify-between items-center px-4 sm:px-8 h-20 transition-all duration-300 ${
          scrolled
            ? isDarkMode
              ? 'bg-[#0D0D0D]/80 backdrop-blur-md shadow-lg shadow-black/40'
              : 'bg-white/80 backdrop-blur-md shadow-md'
            : isDarkMode
              ? 'bg-[#0D0D0D]'
              : 'bg-white'
        }`}
      >
        <Link href="/HomePage" passHref>
          <Image
            src="/logo.png"
            alt="Boostify Logo"
            className="h-18 w-28 transition-transform duration-300 hover:scale-105"
            width={50}
            height={50}
          />
        </Link>
        <nav className="flex items-center gap-5">
          <button onClick={toggleMode} className="transition-transform duration-300 hover:rotate-12">
            <Image
              src={isDarkMode ? '/light-mode-icon.png' : '/moon.png'}
              alt={isDarkMode ? 'Light Mode Icon' : 'Dark Mode Icon'}
              className="h-7 w-9"
              width={24}
              height={24}
            />
          </button>
          <button className="flex flex-col gap-1.5 bg-transparent border-none cursor-pointer md:hidden" onClick={handleMenuToggle}>
            <span className="w-6 h-0.5 bg-gray-500"></span>
            <span className="w-6 h-0.5 bg-gray-500"></span>
            <span className="w-6 h-0.5 bg-gray-500"></span>
          </button>
          <ul className={`flex-col items-center gap-8 transition-all duration-300 md:flex ${isMenuOpen ? 'flex' : 'hidden'} ${isDarkMode ? 'bg-[#0D0D0D] text-white' : 'bg-white text-black'} absolute top-20 left-0 right-0 p-4 md:static md:flex-row md:bg-transparent md:p-0 shadow-lg md:shadow-none z-50`}>
            <li className="w-full text-center md:w-auto">
              <Link href="/About" passHref><span className={linkClass}>About</span></Link>
            </li>
            <li className="w-full text-center md:w-auto">
              <Link href="/Team" passHref><span className={linkClass}>Our Team</span></Link>
            </li>
            <li className="w-full text-center md:w-auto">
              <button onClick={() => setShowPopup(true)} className={`relative font-bold pb-1 transition-colors after:absolute after:left-0 after:bottom-0 after:h-0.5 after:w-0 after:rounded-full after:bg-current after:transition-all after:duration-300 hover:after:w-full ${isDarkMode ? 'text-[#EAD196]' : 'text-red-700'}`}>
                Sign Out
              </button>
            </li>
          </ul>
          <Link href="/Profile" passHref>
            <div className="bg-transparent border-none cursor-pointer">
              <div className="flex items-center justify-center bg-[#EAD196] rounded-full w-12 h-12 transition-transform duration-300 hover:scale-110">
                {assistantCode && <span className="text-red-700 font-bold text-sm">{assistantCode}</span>}
              </div>
            </div>
          </Link>
        </nav>
      </header>

      {showPopup && <SignOut onClose={() => setShowPopup(false)} onSignOut={handleSignOut} />}
    </>
  );
};

export default HomeNav;