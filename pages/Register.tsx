import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Link from 'next/link';
import { useTheme } from '../styles/ThemeContext';

const Register: React.FC = () => {
  const [name, setName] = useState<string>('');
  const [assistantCode, setAssistantCode] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const router = useRouter();
  const { isDarkMode } = useTheme();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (password !== confirmPassword) {
      setError('Password tidak cocok');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('https://web-boostify.vercel.app/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          assisstant_code: assistantCode,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Registrasi gagal');
      } else {
        setSuccess('Registrasi berhasil! Silakan login.');
        setTimeout(() => router.push('/SignIn'), 2000);
      }
    } catch (err: any) {
      setError('Terjadi kesalahan, coba lagi.');
    }

    setLoading(false);
  };

  return (
    <div className={`flex flex-col items-center justify-center min-h-screen pt-12 pl-10 ${isDarkMode ? 'bg-[#0D0D0D]' : 'bg-gray-100'}`}>
      <div className="mb-20">
        <Link href="/">
          <Image src="/logo.png" alt="Boostify Logo" width={200} height={100} className="cursor-pointer" />
        </Link>
      </div>
      <div className={`p-8 rounded-lg shadow-lg max-w-md w-full text-center ${isDarkMode ? 'bg-[#5B0A0A]' : 'bg-[#7D0A0A]'}`}>
        <h2 className={`text-2xl mb-8 font-bold ${isDarkMode ? 'text-[#BDBDBD]' : 'text-[#EAD196]'}`}>
          Create Your Account
        </h2>
        <form className="flex flex-col gap-5" onSubmit={handleRegister}>
          <input
            type="text"
            className={`p-4 rounded border-none text-lg ${isDarkMode ? 'bg-[#D7B66A] text-[#5B0A0A]' : 'bg-[#F3EDC8] text-[#BF3131]'} w-full`}
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            type="text"
            className={`p-4 rounded border-none text-lg ${isDarkMode ? 'bg-[#D7B66A] text-[#5B0A0A]' : 'bg-[#F3EDC8] text-[#BF3131]'} w-full`}
            placeholder="Assistant Code"
            value={assistantCode}
            onChange={(e) => setAssistantCode(e.target.value.toUpperCase())}
            required
          />
          <div className="relative flex items-center w-full">
            <input
              type={showPassword ? 'text' : 'password'}
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
          <input
            type="password"
            className={`p-4 rounded border-none text-lg ${isDarkMode ? 'bg-[#D7B66A] text-[#5B0A0A]' : 'bg-[#F3EDC8] text-[#BF3131]'} w-full`}
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          {error && <div className="text-red-400 mt-2">{error}</div>}
          {success && <div className="text-green-400 mt-2">{success}</div>}
          <button
            type="submit"
            className={`py-2 px-4 rounded font-bold transition-colors ${isDarkMode ? 'bg-[#D7B66A] text-[#5B0A0A] hover:bg-yellow-300' : 'bg-[#F3EDC8] text-[#BF3131] hover:bg-yellow-200'} mt-6`}
            disabled={loading}
          >
            {loading ? 'Registering...' : 'Register'}
          </button>
          <p className={`mt-2 text-sm ${isDarkMode ? 'text-[#BDBDBD]' : 'text-[#EAD196]'}`}>
            Sudah punya akun?{' '}
            <Link href="/SignIn" className="font-bold underline">
              Sign In
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;