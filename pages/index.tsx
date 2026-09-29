import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import Navbar from '../components/Navbar';
import HomeNav from '../components/HomeNav';
import Footer from '../components/Footer';
import { useTheme } from '../styles/ThemeContext';
import Link from 'next/link';
import Image from 'next/image';

const LandingPage: React.FC = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(true);
  const { isDarkMode } = useTheme();

  useEffect(() => {
    if (status === 'loading') return;
    if (session) {
      router.push('/HomePage');
    } else {
      setIsLoading(false);
    }
  }, [session, status, router]);

  if (isLoading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDarkMode ? 'bg-[#0D0D0D]' : 'bg-white'}`}>
        <div className="w-12 h-12 rounded-full border-4 border-[#EAD196] border-t-[#7D0A0A] animate-spin" />
      </div>
    );
  }

  const chips = ['Face Recognition', 'Real-time', 'Smile Detection'];

  return (
    <div className={`relative min-h-screen flex flex-col ${isDarkMode ? 'bg-[#0D0D0D] text-gray-100' : 'bg-white text-gray-900'}`}>
      {/* Soft background decoration */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className={`glow absolute -top-32 -left-24 w-96 h-96 rounded-full blur-3xl ${isDarkMode ? 'bg-[#7D0A0A]/30' : 'bg-[#7D0A0A]/10'}`} />
        <div className={`glow absolute bottom-0 -right-24 w-96 h-96 rounded-full blur-3xl ${isDarkMode ? 'bg-[#EAD196]/15' : 'bg-[#EAD196]/40'}`} style={{ animationDelay: '2s' }} />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        {session ? <HomeNav /> : <Navbar />}

        {/* HERO */}
        <main className="flex-1 flex flex-col lg:flex-row items-center lg:justify-between mt-8 sm:mt-10 md:mt-12 lg:mt-16 mx-4 sm:mx-5 md:mx-8 lg:mx-10 xl:mx-16">
          <div className="lg:w-1/2 text-left mb-8 sm:mb-10 md:mb-12 lg:mb-0">
            <span
              className={`animate-fadeUp inline-flex items-center gap-2 px-3 py-1 mb-5 rounded-full text-xs font-semibold tracking-wide border ${
                isDarkMode ? 'bg-[#1A0808] border-[#3A1010] text-[#EAD196]' : 'bg-[#FFF8E6] border-[#EAD196] text-[#7D0A0A]'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-[#BF3131] animate-pulse" />
              Smile-Powered Attendance
            </span>

            <h1
              className={`animate-fadeUp text-3xl sm:text-4xl md:text-5xl font-bold mb-5 leading-tight ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}
              style={{ animationDelay: '0.1s' }}
            >
              Capture Your{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#BF3131] to-[#D7B66A]">
                Smile
              </span>
              , Capture Your Presence
            </h1>

            <p
              className={`animate-fadeUp text-sm sm:text-base md:text-lg leading-relaxed text-justify ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}
              style={{ animationDelay: '0.2s' }}
            >
              This device is an attendance system based on facial recognition technology that requires users to smile as a sign of presence. With just a smile, your attendance is automatically recorded, enhancing the positive atmosphere in the workplace or school. Additionally, this device aims to boost people&apos;s enthusiasm and motivation to start their day with a smile, creating a more positive and productive environment.
            </p>

            <div className="animate-fadeUp mt-5 flex flex-wrap gap-2" style={{ animationDelay: '0.3s' }}>
              {chips.map((c) => (
                <span
                  key={c}
                  className={`px-3 py-1 rounded-full text-xs font-medium border ${
                    isDarkMode ? 'border-[#3A1010] text-gray-300 bg-[#160707]' : 'border-[#EAD196] text-[#7D0A0A] bg-[#FFF8E6]'
                  }`}
                >
                  {c}
                </span>
              ))}
            </div>

            <div className="animate-fadeUp mt-7" style={{ animationDelay: '0.4s' }}>
              <Link href="/SignIn" passHref>
                <button className="group inline-flex items-center gap-2 bg-[#7D0A0A] text-[#EAD196] py-3 px-7 rounded-lg font-semibold shadow-lg transition-all duration-300 hover:bg-red-700 hover:-translate-y-0.5">
                  See Your Attendance
                  <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                </button>
              </Link>
            </div>
          </div>

          <div className="lg:w-1/2 flex justify-center relative">
            <div className={`glow absolute w-72 h-72 sm:w-80 sm:h-80 rounded-full blur-3xl ${isDarkMode ? 'bg-[#7D0A0A]/40' : 'bg-[#EAD196]/60'}`} />
            <Image
              src="/smile-image.png"
              alt="Smiling Face"
              width={320}
              height={320}
              priority
              className="float relative h-64 w-64 sm:h-72 sm:w-72 md:h-80 md:w-80 lg:h-90 lg:w-90 xl:h-[23rem] xl:w-[23rem]"
            />
          </div>
        </main>

        <Footer />
      </div>

      <style jsx>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes floatY {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-16px); }
        }
        @keyframes glowPulse {
          0%, 100% { opacity: 0.55; }
          50% { opacity: 0.9; }
        }
        .animate-fadeUp { animation: fadeUp 0.7s ease-out both; }
        .float { animation: floatY 5s ease-in-out infinite; }
        .glow { animation: glowPulse 4s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) {
          .animate-fadeUp, .float, .glow { animation: none; }
        }
      `}</style>
    </div>
  );
};

export default LandingPage;