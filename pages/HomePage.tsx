import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Footer from '../components/Footer';
import HomeNav from '../components/HomeNav';
import { useTheme } from '../styles/ThemeContext';

const HomePage: React.FC = () => {
  const { isDarkMode } = useTheme();

  const cardBase = isDarkMode
    ? 'bg-[#160707] border-[#3A1010]'
    : 'bg-white border-[#EAD196]';
  const cardDesc = isDarkMode ? 'text-gray-400' : 'text-gray-500';

  const features = [
    {
      href: '/LiveReport',
      title: 'Live Report',
      desc: 'Monitor attendance in real-time.',
      icon: (
        <path d="M3 12h3l2-7 4 14 2-7h4" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      ),
    },
    {
      href: '/Recap',
      title: 'Recap',
      desc: 'Attendance recap and assistant ranking.',
      icon: (
        <>
          <rect x="4" y="13" width="4" height="7" rx="1" strokeWidth="2" fill="none" />
          <rect x="10" y="9" width="4" height="11" rx="1" strokeWidth="2" fill="none" />
          <rect x="16" y="5" width="4" height="15" rx="1" strokeWidth="2" fill="none" />
        </>
      ),
    },
  ];

  return (
    <div className={`relative flex flex-col min-h-screen ${isDarkMode ? 'bg-[#0D0D0D] text-gray-200' : 'bg-white text-gray-900'}`}>
      {/* Soft background decoration */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className={`glow absolute -top-32 -left-24 w-96 h-96 rounded-full blur-3xl ${isDarkMode ? 'bg-[#7D0A0A]/30' : 'bg-[#7D0A0A]/10'}`} />
        <div className={`glow absolute top-40 -right-24 w-96 h-96 rounded-full blur-3xl ${isDarkMode ? 'bg-[#EAD196]/15' : 'bg-[#EAD196]/40'}`} style={{ animationDelay: '2s' }} />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        <HomeNav />

        {/* HERO */}
        <main className="flex flex-col lg:flex-row items-center lg:justify-between mt-8 sm:mt-10 md:mt-12 lg:mt-16 mx-4 sm:mx-5 md:mx-8 lg:mx-10 xl:mx-16">
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
              This device is an attendance system based on facial recognition technology that requires users to smile as a sign of presence. With just a smile, your attendance is automatically recorded and enhances the positive atmosphere in the workplace or school.
            </p>
          </div>

          <div className="lg:w-1/2 flex justify-center relative">
            <div className={`glow absolute w-72 h-72 sm:w-80 sm:h-80 rounded-full blur-3xl ${isDarkMode ? 'bg-[#7D0A0A]/40' : 'bg-[#EAD196]/60'}`} />
            <Image
              src="/smile-image.png"
              alt="Capture Presence"
              width={300}
              height={300}
              priority
              className="float relative h-50 w-50 sm:h-72 sm:w-72 md:h-80 md:w-80 lg:h-90 lg:w-90 xl:h-[20rem] xl:w-[20rem]"
            />
          </div>
        </main>

        {/* ATTENDANCE */}
        <section className="flex flex-col items-center py-16 px-4 gap-2">
          <h2 className={`animate-fadeUp text-2xl sm:text-3xl lg:text-4xl font-bold ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
            ATTENDANCE
          </h2>
          <p className={`animate-fadeUp mb-10 text-sm ${cardDesc}`} style={{ animationDelay: '0.1s' }}>
            Choose a menu to get started
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 w-full max-w-xl items-stretch">
            {features.map((f, i) => (
              <Link href={f.href} key={f.title} className="block h-full">
                <div
                  className={`animate-fadeUp group relative h-full flex flex-col items-center text-center rounded-2xl border p-6 pt-7 shadow-md overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:border-[#7D0A0A] ${cardBase}`}
                  style={{ animationDelay: `${0.15 + i * 0.1}s` }}
                >
                  {/* Accent line on top */}
                  <span className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-[#7D0A0A] to-[#D7B66A] scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300" />

                  <div className="flex items-center justify-center w-14 h-14 mb-4 rounded-xl bg-gradient-to-br from-[#7D0A0A] to-[#BF3131] shadow-md transition-transform group-hover:scale-110">
                    <svg viewBox="0 0 24 24" className="w-7 h-7 text-[#EAD196]" stroke="currentColor">
                      {f.icon}
                    </svg>
                  </div>

                  <h3 className={`text-lg font-bold mb-1 ${isDarkMode ? 'text-[#EAD196]' : 'text-[#7D0A0A]'}`}>
                    {f.title}
                  </h3>
                  <p className={`text-sm ${cardDesc}`}>{f.desc}</p>

                  <span className={`mt-4 text-xs font-semibold opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all duration-300 ${isDarkMode ? 'text-[#EAD196]' : 'text-[#7D0A0A]'}`}>
                    Open →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

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

export default HomePage;