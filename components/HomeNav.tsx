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
  const router = useRouter();
  const { isDarkMode, toggleMode } = useTheme();

  useEffect(() => {
    const fetchUserData = async () => {
      const authDataString = localStorage.getItem('authData');
      console.log('Retrieved authData from localStorage:', authDataString);

      if (authDataString) {
        const authData = JSON.parse(authDataString);
        const token = authData.token.token;
        console.log('Extracted token:', token);

        if (token) {
          try {
            const response = await fetch('https://boostify-back-end.vercel.app/api/whoami', {
              method: 'GET',
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
              },
            });

            if (!response.ok) {
              if (response.status === 401) {
                console.warn('Token invalid, redirecting to SignIn');
                localStorage.removeItem('authData');
                router.push('/SignIn');
              } else {
                const errorText = await response.text();
                throw new Error(`Network response was not ok: ${errorText}`);
              }
            }

            const data = await response.json();
            console.log('Fetched user data:', data);
            setUserName(data.name);
            setAssistantCode(data.assisstant_code);
          } catch (error) {
            console.error('Failed to fetch user data:', error);
          }
        } else {
          console.warn('No token found in authData');
        }
      } else {
        console.warn('No authData found');
      }
    };

    fetchUserData();
  }, [router]);

  const handleSignOut = async () => {
    try {
      localStorage.removeItem('authData');
      localStorage.removeItem('nextauth.message');
      console.log('Sign out successful, session and token removed');

      await signOut({ callbackUrl: '/' });
    } catch (error) {
      console.error('Sign out failed:', error);
    } finally {
      setShowPopup(false);
    }
  };

  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
    console.log('Menu Toggled:', isMenuOpen); // Debugging log
  };

  return (
    <div className={`w-full min-h-100 ${isDarkMode ? 'bg-[#0D0D0D] text-white' : 'bg-white text-black'}`}>
      <header className={`flex justify-between items-center px-4 py-4 mt-4 h-20 ${isDarkMode ? 'bg-[#0D0D0D] text-white' : 'bg-white text-black'}`}>
        <Link href="/HomePage" passHref>
          <Image
            src="/logo.png"
            alt="Boostify Logo"
            className="h-18 w-28"
            width={50}
            height={50}
          />
        </Link>
        <nav className="flex items-center gap-5">
          <button onClick={toggleMode} className="transition-transform duration-300">
            <Image
              src={isDarkMode ? "/light-mode-icon.png" : "/moon.png"}
              alt={isDarkMode ? "Light Mode Icon" : "Dark Mode Icon"}
              className="h-7 w-9 hover:rotate-20"
              width={24}
              height={24}
            />
          </button>
          <button className="flex flex-col gap-1.5 bg-transparent border-none cursor-pointer md:hidden" onClick={handleMenuToggle}>
            <span className="w-6 h-0.5 bg-gray-500"></span>
            <span className="w-6 h-0.5 bg-gray-500"></span>
            <span className="w-6 h-0.5 bg-gray-500"></span>
          </button>
          {/* Navbar Links */}
          <ul className={`flex-col items-center gap-8 transition-all duration-300 md:flex ${isMenuOpen ? 'flex' : 'hidden'} ${isDarkMode ? 'bg-[#0D0D0D] text-white' : 'bg-white text-black'} absolute top-20 left-0 right-0 p-4 md:static md:flex-row md:shadow-none shadow-lg z-50`}>
            <li className="w-full text-center md:w-auto">
              <Link href="/About" passHref>
                <span className={`font-medium ${isDarkMode ? 'text-[#EAD196]' : 'text-red-700'}`}>
                  About
                </span>
              </Link>
            </li>
            <li className="w-full text-center md:w-auto">
              <Link href="/Team" passHref>
                <span className={`font-medium ${isDarkMode ? 'text-[#EAD196]' : 'text-red-700'}`}>
                  Our Team
                </span>
              </Link>
            </li>
            <li className="w-full text-center md:w-auto">
              <Link href="/Prediction" passHref>
                <span className={`font-medium ${isDarkMode ? 'text-[#EAD196]' : 'text-red-700'}`}>
                  Prediksi
                </span>
              </Link>
            </li>
            <li className="w-full text-center md:w-auto">
              <button onClick={() => setShowPopup(true)} className={`font-bold ${isDarkMode ? 'text-[#EAD196]' : 'text-red-700'}`}>
                Sign Out
              </button>
            </li>
          </ul>
          <Link href="/Profile" passHref>
            <div className="bg-transparent border-none cursor-pointer">
              <div className="flex items-center justify-center bg-[#EAD196] rounded-full w-12 h-12">
                {assistantCode && (
                  <span className="text-red-700 font-bold text-sm">{assistantCode}</span>
                )}
              </div>
            </div>
          </Link>
        </nav>
      </header>

      {showPopup && <SignOut onClose={() => setShowPopup(false)} onSignOut={handleSignOut} />}
    </div>
  );
};

export default HomeNav;