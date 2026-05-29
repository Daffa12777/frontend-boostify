// pages/Prediction.tsx
import React, { useEffect, useState } from 'react';
import HomeNav from '../components/HomeNav';
import Footer from '../components/Footer';
import { useTheme } from '../styles/ThemeContext';

type Slot = {
  day: number;
  dayName: string;
  hour: number;
  avgCheckins: number;
  totalCheckins: number;
  level: 'ramai' | 'sedang' | 'sepi';
};

type Prediction = {
  totalRecords: number;
  maxAvg: number;
  busiest: { label: string; avgCheckins: number }[];
  heatmap: Slot[];
};

const DAYS = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];
const DAY_ORDER = [1, 2, 3, 4, 5, 6, 0];
const HOURS = Array.from({ length: 13 }, (_, i) => i + 7); // 07:00 - 19:00

const API_BASE = 'https://web-boostify.vercel.app/api';

const Prediction = () => {
  const { isDarkMode } = useTheme();
  const [data, setData] = useState<Prediction | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${API_BASE}/prediction`);
        const json = await res.json();
        if (json.success) setData(json.payload);
        else setError(json.message || 'Gagal memuat data');
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const map: Record<string, Slot> = {};
  data?.heatmap.forEach((s) => (map[`${s.day}-${s.hour}`] = s));

  // warna kotak heatmap per level
  const cellStyle = (slot?: Slot) => {
    if (!slot) {
      return isDarkMode
        ? 'bg-white/5 text-transparent'
        : 'bg-gray-100 text-transparent';
    }
    if (slot.level === 'ramai') return 'bg-[#BF3131] text-white font-bold';
    if (slot.level === 'sedang') return 'bg-[#E0A93B] text-[#5B0A0A] font-bold';
    return 'bg-[#9ED1A1] text-[#1F5E2A] font-bold';
  };

  const cardBg = isDarkMode ? 'bg-[#1A1A1A] border-[#3A1010]' : 'bg-white border-gray-200';
  const subText = isDarkMode ? 'text-gray-400' : 'text-gray-500';
  const accent = isDarkMode ? 'text-[#EAD196]' : 'text-[#BF3131]';

  const isSparse = !!data && data.totalRecords < 20;

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-[#0D0D0D] text-white' : 'bg-gray-50 text-gray-900'}`}>
      <HomeNav />

      <main className="max-w-5xl mx-auto px-5 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className={`text-3xl font-extrabold ${accent}`}>Prediksi Keramaian Lab</h1>
          <p className={`mt-1 ${subText}`}>
            Perkiraan jam ramai &amp; sepi berdasarkan pola kehadiran historis.
          </p>
        </div>

        {loading && <p className={subText}>Memuat data...</p>}
        {error && (
          <div className="rounded-lg bg-red-100 text-red-700 px-4 py-3 border border-red-200">
            {error}
          </div>
        )}

        {data && (
          <>
            {/* Banner kalau data masih sedikit */}
            {isSparse && (
              <div className={`mb-6 rounded-xl px-4 py-3 text-sm border ${
                isDarkMode
                  ? 'bg-[#3A2A0A] border-[#5C4410] text-[#EAD196]'
                  : 'bg-[#FFF8E6] border-[#EAD196] text-[#7A5A0A]'
              }`}>
                Data kehadiran masih sedikit (<b>{data.totalRecords} record</b>), jadi prediksinya
                belum mewakili pola sebenarnya. Heatmap akan makin akurat seiring bertambahnya absensi.
              </div>
            )}

            {/* Kartu Jam Tersibuk */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              {data.busiest.map((b, i) => (
                <div key={i} className={`rounded-xl border p-4 ${cardBg}`}>
                  <div className={`text-xs uppercase tracking-wide ${subText}`}>
                    Jam Tersibuk #{i + 1}
                  </div>
                  <div className={`mt-1 text-xl font-bold ${accent}`}>{b.label}</div>
                  <div className={`text-sm ${subText}`}>± {b.avgCheckins} orang</div>
                </div>
              ))}
            </div>

            {/* Heatmap */}
            <div className={`rounded-2xl border p-5 ${cardBg}`}>
              <h2 className="text-lg font-bold mb-4">Pola Kehadiran per Jam</h2>
              <div className="overflow-x-auto">
                <table className="border-separate" style={{ borderSpacing: '4px' }}>
                  <thead>
                    <tr>
                      <th className="w-16"></th>
                      {HOURS.map((h) => (
                        <th key={h} className={`text-xs font-medium pb-1 ${subText}`}>
                          {String(h).padStart(2, '0')}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {DAY_ORDER.map((d, idx) => (
                      <tr key={d}>
                        <td className="text-sm font-semibold pr-2 whitespace-nowrap">{DAYS[idx]}</td>
                        {HOURS.map((h) => {
                          const slot = map[`${d}-${h}`];
                          return (
                            <td key={h} className="p-0">
                              <div
                                title={slot ? `${DAYS[idx]} ${h}:00 — ${slot.avgCheckins} orang (${slot.level})` : 'Tidak ada data'}
                                className={`w-9 h-9 flex items-center justify-center rounded-md text-[11px] transition-transform hover:scale-110 ${cellStyle(slot)}`}
                              >
                                {slot ? slot.avgCheckins : '·'}
                              </div>
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Legend */}
              <div className="flex flex-wrap items-center gap-4 mt-5 text-sm">
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded bg-[#BF3131] inline-block" /> Ramai
                </span>
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded bg-[#E0A93B] inline-block" /> Sedang
                </span>
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded bg-[#9ED1A1] inline-block" /> Sepi
                </span>
                <span className={`flex items-center gap-2 ${subText}`}>
                  <span className={`w-4 h-4 rounded inline-block ${isDarkMode ? 'bg-white/5' : 'bg-gray-100'}`} /> Tidak ada data
                </span>
              </div>

              <p className={`mt-4 text-xs ${subText}`}>
                Total {data.totalRecords} record kehadiran dianalisis · angka = rata-rata orang per jam.
              </p>
            </div>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Prediction;