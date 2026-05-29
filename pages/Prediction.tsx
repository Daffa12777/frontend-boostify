// pages/Prediction.tsx
import React, { useEffect, useState } from 'react';
import HomeNav from '../components/HomeNav';
import Footer from '../components/Footer';

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
const DAY_ORDER = [1, 2, 3, 4, 5, 6, 0]; // Senin..Minggu
const HOURS = Array.from({ length: 13 }, (_, i) => i + 7); // 07:00 - 19:00

// URL backend Vercel kamu
const API_BASE = 'https://boostify-back-end.vercel.app/api';

const levelColor: Record<string, string> = {
  ramai: '#ef4444',
  sedang: '#f59e0b',
  sepi: '#86efac',
};

const Prediction = () => {
  const [data, setData] = useState<Prediction | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
  const fetchData = async () => {
    try {
      const authDataString = localStorage.getItem('authData');
      const token = authDataString ? JSON.parse(authDataString).token.token : null;

      const res = await fetch(`${API_BASE}/prediction`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
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

  // lookup cepat: map[`${day}-${hour}`] = slot
  const map: Record<string, Slot> = {};
  data?.heatmap.forEach((s) => (map[`${s.day}-${s.hour}`] = s));

  return (
    <div>
      <HomeNav />
      <div style={{ padding: '24px', maxWidth: 900, margin: '0 auto' }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 4 }}>Prediksi Keramaian Lab</h1>
        <p style={{ color: '#6b7280', marginBottom: 24 }}>
          Berdasarkan pola kehadiran historis (rata-rata check-in per jam &amp; hari).
        </p>

        {loading && <p>Memuat...</p>}
        {error && <p style={{ color: '#ef4444' }}>{error}</p>}

        {data && (
          <>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 24 }}>
              {data.busiest.map((b, i) => (
                <div key={i} style={{ padding: '12px 16px', borderRadius: 10, background: '#f3f4f6' }}>
                  <div style={{ fontSize: 12, color: '#6b7280' }}>Jam Tersibuk #{i + 1}</div>
                  <div style={{ fontWeight: 700 }}>{b.label}</div>
                  <div style={{ fontSize: 12 }}>~{b.avgCheckins} orang</div>
                </div>
              ))}
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ borderCollapse: 'collapse', width: '100%' }}>
                <thead>
                  <tr>
                    <th style={{ padding: 6, fontSize: 12 }}></th>
                    {HOURS.map((h) => (
                      <th key={h} style={{ padding: 6, fontSize: 11, color: '#6b7280' }}>
                        {String(h).padStart(2, '0')}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {DAY_ORDER.map((d, idx) => (
                    <tr key={d}>
                      <td style={{ padding: 6, fontSize: 12, fontWeight: 600 }}>{DAYS[idx]}</td>
                      {HOURS.map((h) => {
                        const slot = map[`${d}-${h}`];
                        return (
                          <td
                            key={h}
                            title={slot ? `${slot.avgCheckins} orang (${slot.level})` : 'tidak ada data'}
                            style={{
                              width: 34,
                              height: 30,
                              textAlign: 'center',
                              fontSize: 10,
                              borderRadius: 4,
                              background: slot ? levelColor[slot.level] : '#f9fafb',
                              color: slot && slot.level === 'sepi' ? '#166534' : '#fff',
                            }}
                          >
                            {slot ? slot.avgCheckins : ''}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div style={{ display: 'flex', gap: 16, marginTop: 16, fontSize: 12 }}>
              <span><span style={{ background: levelColor.ramai, padding: '2px 8px', borderRadius: 4, color: '#fff' }}>Ramai</span></span>
              <span><span style={{ background: levelColor.sedang, padding: '2px 8px', borderRadius: 4, color: '#fff' }}>Sedang</span></span>
              <span><span style={{ background: levelColor.sepi, padding: '2px 8px', borderRadius: 4, color: '#166534' }}>Sepi</span></span>
            </div>

            <p style={{ fontSize: 12, color: '#9ca3af', marginTop: 16 }}>
              Total {data.totalRecords} record kehadiran dianalisis.
            </p>
          </>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Prediction;
