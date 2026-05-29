import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { signIn, useSession, getSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { DefaultSession } from 'next-auth';
import { useTheme } from '../styles/ThemeContext';

interface CustomUser {
  id?: number;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  token?: string;
  assistantCode?: string;
}

interface CustomSession extends DefaultSession {
  user: CustomUser;
}

const SignIn: React.FC = () => {
  const [assistantCode, setAssistantCode] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { isDarkMode } = useTheme();
  const { data: session } = useSession() as { data: CustomSession | null };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const result = await signIn('credentials', {
      redirect: false,
      assisstant_code: assistantCode,
      password,
    });

    setLoading(false);

    if (result?.error) {
      setError('Invalid credentials');
    } else {
      const session = await getSession() as unknown as CustomSession;
      if (session?.user?.token) {
        const userData = {
          id: session.user.id,
          name: session.user.name,
          assistant_code: session.user.assistantCode,
          token: session.user.token,
        };
        localStorage.setItem('authData', JSON.stringify(userData));
      }
      router.push('/HomePage');
    }
  };

  const handleAssistantCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase();
    setAssistantCode(value);
  };

  return (
    <div className={`flex flex-col items-center justify-center min-h-screen pt-12 pl-10 ${isDarkMode ? 'bg-[#0D0D0D]' : 'bg-gray-100'}`}>
      <div className="mb-20">
        <Link href="/">
          <Image src="/logo.png" alt="Boostify Logo" width={200} height={100} className="cursor-pointer" />
        </Link>
      </div>
      <div className={`p-8 rounded-lg shadow-lg max-w-md w-full text-center ${isDarkMode ? 'bg-[#5B0A0A]' : 'bg-[#7D0A0A]'}`}>
        <h2 className={`text-2xl mb-8 font-bold ${isDarkMode ? 'text-[#BDBDBD]' : 'text-[#EAD196]'}`}>Sign In to Your Account</h2>
        <form className="flex flex-col gap-5" onSubmit={handleSignIn}>
          <div className="flex flex-col w-full">
            <label htmlFor="assistantCode" className="sr-only">Assistant Code</label>
            <input
              type="text"
              id="assistantCode"
              className={`p-4 rounded border-none text-lg ${isDarkMode ? 'bg-[#D7B66A] text-[#5B0A0A]' : 'bg-[#F3EDC8] text-[#BF3131]'} w-full`}
              placeholder="Assistant Code"
              value={assistantCode}
              onChange={handleAssistantCodeChange}
              required
            />
          </div>
          <div className="relative flex items-center w-full">
            <label htmlFor="password" className="sr-only">Password</label>
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              className={`p-4 rounded border-none text-lg ${isDarkMode ? 'bg-[#D7B66A] text-[#5B0A0A]' : 'bg-[#F3EDC8] text-[#BF3131]'} w-full`}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className={`absolute right-4 cursor-pointer ${isDarkMode ? 'text-[#5B0A0A]' : 'text-[#BF3131]'}`}
            >
              <Image
                src={showPassword ? '/eye-slash.png' : '/eye.png'}
                alt="Toggle Password Visibility"
                width={35} height={30}
              />
            </button>
          </div>
          {error && <div className="text-red-500 mt-2">{error}</div>}
          <button
            type="submit"
            className={`py-2 px-4 rounded font-bold transition-colors ${isDarkMode ? 'bg-[#D7B66A] text-[#5B0A0A] hover:bg-yellow-300' : 'bg-[#F3EDC8] text-[#BF3131] hover:bg-yellow-200'} mt-6`}
            disabled={loading}
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
          <p className={`mt-2 text-sm ${isDarkMode ? 'text-[#BDBDBD]' : 'text-[#EAD196]'}`}>
            Belum punya akun?{' '}
            <Link href="/Register" className="font-bold underline">
              Register
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default SignIn;