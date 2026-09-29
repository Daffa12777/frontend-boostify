import React, { useEffect, useState } from 'react';
import HomeNav from '../components/HomeNav';
import Footer from '../components/Footer';
import { useTheme } from '../styles/ThemeContext';

type Slot = {
  day: number; dayName: string; hour: number;
  avgCheckins: number; totalCheckins: number;
  level: 'ramai' | 'sedang' | 'sepi';
};
type Prediction = {
  totalRecords: number; maxAvg: number;
  busiest: { label: string; avgCheckins: number }[];
  heatmap: Slot[];
};
type Next3Slot = {
  day: number; hour: number; dayName: string; label: string;
  predictedCount: number; level: 'ramai' | 'sedang' | 'sepi';
};
type Next3Data = {
  currentTime: string; dominantLevel: 'ramai' | 'sedang' | 'sepi'; slots: Next3Slot[];
};

const DAYS_EN = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
const DAY_ORDER = [1,2,3,4,5,6,0];
const DAY_NAMES_JS = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
const HOURS = Array.from({ length: 13 }, (_, i) => i + 7);
const API_BASE = 'http://localhost:5000/api';

const LEVEL_CONFIG = {
  ramai:  { bg: 'bg-[#BF3131]', badge: 'bg-[#BF3131]/10 text-[#BF3131] border-[#BF3131]/30', icon: '🔴', label: 'Busy' },
  sedang: { bg: 'bg-[#E0A93B]', badge: 'bg-[#E0A93B]/10 text-[#7A5A0A] border-[#E0A93B]/30', icon: '🟡', label: 'Moderate' },
  sepi:   { bg: 'bg-[#9ED1A1]', badge: 'bg-[#9ED1A1]/10 text-[#1F5E2A] border-[#9ED1A1]/30', icon: '🟢', label: 'Quiet' },
};

const Prediction = () => {
  const { isDarkMode } = useTheme();
  const [data, setData] = useState<Prediction | null>(null);
  const [next3, setNext3] = useState<Next3Data | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [res1, res2] = await Promise.all([
          fetch(`${API_BASE}/prediction`),
          fetch(`${API_BASE}/prediction/next3hours`),
        ]);
        const json1 = await res1.json();
        const json2 = await res2.json();
        if (json1.success) setData(json1.payload);
        else setError(json1.message || 'Failed to load data');
        if (json2.success) setNext3(json2.payload);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const map: Record<string, Slot> = {};
  data?.heatmap.forEach((s) => (map[`${s.day}-${s.hour}`] = s));

  const peaks = data
    ? [...data.heatmap].filter((s) => s.avgCheckins > 0)
        .sort((a, b) => b.avgCheckins - a.avgCheckins).slice(0, 3)
        .map((s) => ({ label: `${DAY_NAMES_JS[s.day]} ${String(s.hour).padStart(2,'0')}:00`, avg: s.avgCheckins }))
    : [];

  const cellStyle = (slot?: Slot) => {
    if (!slot || slot.avgCheckins <= 0) return isDarkMode ? 'bg-white/5 text-transparent' : 'bg-gray-100 text-transparent';
    if (slot.level === 'ramai') return 'bg-[#BF3131] text-white font-bold';
    if (slot.level === 'sedang') return 'bg-[#E0A93B] text-[#5B0A0A] font-bold';
    return 'bg-[#9ED1A1] text-[#1F5E2A] font-bold';
  };

  const cardBg = isDarkMode ? 'bg-[#160707] border-[#3A1010]' : 'bg-white border-gray-200';
  const subText = isDarkMode ? 'text-gray-400' : 'text-gray-500';
  const accent = isDarkMode ? 'text-[#EAD196]' : 'text-[#BF3131]';
  const isSparse = !!data && data.totalRecords < 20;

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-[#0D0D0D] text-white' : 'bg-gray-50 text-gray-900'}`}>
      <HomeNav />
      <main className="max-w-5xl mx-auto px-5 py-8">
        {loading && <p className={subText}>Loading data...</p>}
        {error && <div className="rounded-lg bg-red-100 text-red-700 px-4 py-3 border border-red-200">{error}</div>}

        {data && (
          <>
            {isSparse && (
              <div className={`mb-6 rounded-xl px-4 py-3 text-sm border ${isDarkMode ? 'bg-[#3A2A0A] border-[#5C4410] text-[#EAD196]' : 'bg-[#FFF8E6] border-[#EAD196] text-[#7A5A0A]'}`}>
                Limited data so far — only <b>{data.totalRecords}</b> attendance records. Prediction will become more accurate over time.
              </div>
            )}

            {/* Next 3 Hours */}
            {next3 && (
              <div className={`rounded-2xl border p-5 mb-8 ${cardBg}`}>
                <div className="flex items-center justify-between mb-1">
                  <h2 className="text-lg font-bold">Next 3 Hours Prediction</h2>
                  <span className={`text-xs px-3 py-1 rounded-full border font-semibold ${LEVEL_CONFIG[next3.dominantLevel].badge}`}>
                    {LEVEL_CONFIG[next3.dominantLevel].icon} Overall: {LEVEL_CONFIG[next3.dominantLevel].label}
                  </span>
                </div>
                <p className={`text-sm mb-4 ${subText}`}>Prediction from now ({next3.currentTime}) for the next 3 hours</p>
                <div className="grid grid-cols-3 gap-3">
                  {next3.slots.map((slot, i) => {
                    const cfg = LEVEL_CONFIG[slot.level];
                    return (
                      <div key={i} className={`rounded-xl p-4 border ${isDarkMode ? 'border-white/10 bg-white/5' : 'border-gray-100 bg-gray-50'}`}>
                        <div className={`text-xs font-medium mb-1 ${subText}`}>+{i + 1} hour</div>
                        <div className={`text-sm font-bold mb-2 ${accent}`}>{slot.label}</div>
                        <div className="flex items-center gap-2">
                          <span className={`w-3 h-3 rounded-full ${cfg.bg} flex-shrink-0`} />
                          <span className="text-sm font-semibold">{cfg.label}</span>
                        </div>
                        <div className={`text-xs mt-1 ${subText}`}>~{slot.predictedCount} {slot.predictedCount === 1 ? 'person' : 'people'}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Peak Hours */}
            {peaks.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                {peaks.map((p, i) => (
                  <div key={i} className={`rounded-xl border p-4 ${cardBg}`}>
                    <div className={`text-xs uppercase tracking-wide ${subText}`}>Peak Hour {i + 1}</div>
                    <div className={`mt-1 text-xl font-bold ${accent}`}>{p.label}</div>
                    <div className={`text-sm ${subText}`}>About {p.avg} people</div>
                  </div>
                ))}
              </div>
            )}

            {/* Heatmap */}
            <div className={`rounded-2xl border p-5 ${cardBg}`}>
              <h2 className="text-lg font-bold">Hourly Attendance Pattern</h2>
              <p className={`text-sm mt-1 mb-5 ${subText}`}>Each square is the average number of people for that day and time. Redder means busier. Hover a square to see details.</p>
              <div className="overflow-x-auto">
                <table className="border-separate" style={{ borderSpacing: '4px' }}>
                  <thead>
                    <tr>
                      <th className="w-24"></th>
                      {HOURS.map((h) => <th key={h} className={`text-xs font-medium pb-1 ${subText}`}>{String(h).padStart(2,'0')}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    {DAY_ORDER.map((d, idx) => (
                      <tr key={d}>
                        <td className="text-sm font-semibold pr-3 whitespace-nowrap text-right">{DAYS_EN[idx]}</td>
                        {HOURS.map((h) => {
                          const slot = map[`${d}-${h}`];
                          const has = slot && slot.avgCheckins > 0;
                          return (
                            <td key={h} className="p-0">
                              <div
                                title={has ? `${DAYS_EN[idx]} ${h}:00 — about ${slot!.avgCheckins} people` : 'No data'}
                                className={`w-9 h-9 flex items-center justify-center rounded-md text-[11px] transition-transform hover:scale-110 ${cellStyle(slot)}`}
                              >
                                {has ? slot!.avgCheckins : ''}
                              </div>
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex flex-wrap items-center gap-4 mt-6 text-sm">
                <span className="flex items-center gap-2"><span className="w-4 h-4 rounded bg-[#BF3131] inline-block" /> Busy</span>
                <span className="flex items-center gap-2"><span className="w-4 h-4 rounded bg-[#E0A93B] inline-block" /> Moderate</span>
                <span className="flex items-center gap-2"><span className="w-4 h-4 rounded bg-[#9ED1A1] inline-block" /> Quiet</span>
                <span className={`flex items-center gap-2 ${subText}`}><span className={`w-4 h-4 rounded inline-block ${isDarkMode ? 'bg-white/5' : 'bg-gray-100'}`} /> No data</span>
              </div>
              <p className={`mt-4 text-xs ${subText}`}>Based on {data.totalRecords} attendance records. Each number is the average people per hour.</p>
            </div>
          </>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Prediction;