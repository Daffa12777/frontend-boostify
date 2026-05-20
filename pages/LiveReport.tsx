import React, { useEffect, useState } from 'react';
import HomeNav from '../components/HomeNav';
import Footer from '../components/Footer';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

interface AttendanceItem {
  id: number;
  assisstant_code: string;
  name: string;
  time: string;
}

interface ApiResponse {
  assistances: AttendanceItem[];
  total: number;
  currentPage: number;
  totalPages: number;
}

const LiveReport: React.FC = () => {
  const [attendanceData, setAttendanceData] = useState<AttendanceItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  useEffect(() => {
    const fetchAttendanceData = async () => {
      const authDataString = localStorage.getItem('authData');
      if (authDataString) {
        try {
          const authData = JSON.parse(localStorage.getItem('authData') || '{}');

          const response = await fetch(
            'http://localhost:3000/api/attendances?page=' + currentPage,
            {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${authData.token}`,
              },
            }
          );

          if (!response.ok) {
            throw new Error('Network response was not ok');
          }

          const data: ApiResponse = await response.json();
          setAttendanceData(data.assistances);
          setTotalPages(data.totalPages);
        } catch (error: any) {
          console.error('Failed to fetch attendance data:', error.message);
          setError(error.message);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchAttendanceData();
  }, [currentPage]);

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const formatTime = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    };
    return new Date(dateString).toLocaleTimeString(undefined, options);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prevPage => prevPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prevPage => prevPage - 1);
    }
  };

  if (loading) {
    return <div className="text-center mt-4">Loading...</div>;
  }

  if (error) {
    return <div className="text-center mt-4 text-red-500">Error: {error}</div>;
  }

  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
    // Add logic here to filter attendanceData based on selectedDate
  };

  const currentDate = selectedDate || new Date();

  return (
    <div className="max-w-screen-xl mx-auto">
      <HomeNav />
      <h1 className="text-5xl font-bold text-center text-gray-600 my-24">ATTENDANCE</h1>
      <div className="flex items-center justify-center gap-4 mb-8 text-center">
        <label htmlFor="date-picker" className="text-center text-xl text-gray-700">
          Select Date:
        </label>
        <DatePicker
          id="date-picker"
          selected={selectedDate}
          onChange={handleDateChange}
          className="p-2 text-lg border rounded-lg border-gray-300"
          dateFormat="dd/MM/yyyy"
          placeholderText="Click to select a date"
        />
      </div>
      <div className="flex flex-col items-center gap-5 mb-8">
        {attendanceData.map((item) => (
          <div key={item.id} className="bg-[#EAD196] p-5 rounded-lg w-full max-w-3xl flex justify-between items-center shadow-md">
            <div className="flex-1 mr-5 text-left">
              <div className="text-2xl font-bold mb-1">{item.assisstant_code}</div>
              <div className="text-lg text-gray-800">{item.name}</div>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold">{formatDate(item.time)}</div>
              <div className="text-md font-bold">{formatTime(item.time)}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-center items-center gap-4 mb-8">
        {currentPage > 1 && (
          <button
            className="bg-[#7D0A0A] text-[#EAD196] p-2 rounded-lg text-lg cursor-pointer"
            onClick={handlePreviousPage}
          >
            ◀
          </button>
        )}
        <button className="bg-[#7D0A0A] text-[#EAD196] px-4 py-2 rounded-lg font-bold" disabled>
          PAGE {currentPage}
        </button>
        {currentPage < totalPages && (
          <button
            className="bg-[#7D0A0A] text-[#EAD196] p-2 rounded-lg text-lg cursor-pointer"
            onClick={handleNextPage}
          >
            ▶
          </button>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default LiveReport;
