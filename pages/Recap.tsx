import React, { useState, useRef, useEffect } from 'react';
import HomeNav from '../components/HomeNav';
import Footer from '../components/Footer';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Image from 'next/image'; // Import Image from next/image

interface AttendanceItem {
  assisstant_code: string; // Assistant Code
  name: string;
  totalAttendance: number;
}

const Recap: React.FC = () => {
  const [filterOpen, setFilterOpen] = useState(false);
  const [attendanceData, setAttendanceData] = useState<AttendanceItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1); // Default to page 1
  const [totalPages, setTotalPages] = useState<number>(8);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleFilter = () => {
    setFilterOpen(!filterOpen);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setFilterOpen(false);
    }
  };

  useEffect(() => {
    if (filterOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [filterOpen]);

  useEffect(() => {
    const fetchAttendanceData = async () => {
      const authDataString = localStorage.getItem('authData');
      if (authDataString) {
        try {
          const authData = JSON.parse(authDataString);
          const token = authData.token;

          const response = await fetch(`http://localhost:3000/api/recap?page=${currentPage}`, {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });

          if (!response.ok) {
            throw new Error('Failed to fetch attendance data');
          }

          const data = await response.json();
          console.log('Fetched data:', data);

          setAttendanceData(data.payload);
          setTotalPages(data.pagination.totalPages); // Update total pages from the response
          setLoading(false);
        } catch (error: any) {
          setError(error.message);
          setLoading(false);
        }
      } else {
        setError('No authentication token found');
        setLoading(false);
      }
    };

    fetchAttendanceData();
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  // Data for first page's rank section
  const rankedData = attendanceData.slice(0, 3);

  // Data for cards (showing a maximum of 5 cards per page)
  const cardData = attendanceData.slice(3);

  const handleDateChange = (date: Date | null) => {
    setStartDate(date);
    toggleFilter(); // Close dropdown after selecting date
  };

  return (
    <div className="min-h-screen flex flex-col">
      <HomeNav />
      <main className="flex-1 p-6 text-center">
        <h2 className="text-4xl font-bold text-gray-600 my-24">ATTENDANCE RECAP</h2>
        {currentPage === 1 ? (
          // First page specific layout
          <div>
            <div className="relative h-[250px] mb-16">
            {rankedData.map((attendee, index) => {
              const rankClasses = index === 0 
                ? 'top-0 left-1/2 transform -translate-x-1/2' 
                : index === 1 
                ? 'top-36 left-1/4' 
                : 'top-36 right-1/4';
              
              const medalIcon = index === 0 
                ? '/gold-medal.png'
                : index === 1
                ? '/silver-medal.png'
                : '/bronze-medal.png';
              
              return (
                <div key={index} className={`text-center text-red-800 absolute flex flex-col items-center ${rankClasses}`}>
                  <Image 
                    src={medalIcon} 
                    alt="medal" 
                    className="absolute top-[-10px] left-[-15px] w-20 h-20 object-contain z-20" 
                    width={80} // Ganti dengan ukuran yang sesuai
                    height={80} // Ganti dengan ukuran yang sesuai
                  />
                  <div className="bg-[#EAD196] w-36 h-36 rounded-full flex justify-center items-center text-2xl font-bold relative z-10">
                    <span>{attendee.assisstant_code}</span>
                  </div>
                  <p className="text-3xl font-bold text-gray-800 mt-2">{attendee.totalAttendance}</p>
                </div>
              );
            })}
            </div>
            <div className="relative inline-block text-right mt-20">
              <button onClick={toggleFilter} className="text-[#3F3C38] text-base flex items-center">
                Filter
              </button>
              {filterOpen && (
                <div ref={dropdownRef} className="absolute right-0 bg-[#EAD196] shadow-lg rounded-lg p-4 mt-2">
                  <p className="font-bold mb-2">Sort By:</p>
                  <ul className="list-none p-0 m-0">
                    <li className="text-[#3F3C38] text-sm cursor-pointer py-1 hover:underline">
                      <DatePicker selected={startDate} onChange={handleDateChange} placeholderText="Select Date" />
                    </li>
                    <li onClick={toggleFilter} className="text-[#3F3C38] text-sm cursor-pointer py-1 hover:underline">
                      Assistant Code
                    </li>
                  </ul>
                </div>
              )}
            </div>
            <div className="max-w-md mx-auto mt-10 mb-10">
              {attendanceData.map((attendee, index) => (
                <div key={index} className="bg-[#EAD196] flex justify-between p-[20px] my-4 rounded-lg shadow-lg w-full">
                  <div className="text-left">
                    <h3 className="text-2xl font-bold text-[#3F3C38]">{attendee.assisstant_code}</h3>
                    <p className="text-lg text-[#4A4A4A]">{attendee.name}</p>
                  </div>
                  <div className="flex items-center">
                    <div className="bg-[#7D0A0A] rounded-lg p-4 flex items-center justify-center shadow-lg w-[75px] h-[60px] text-2xl text-[#EAD196] text-center">
                      {attendee.totalAttendance}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          // Other pages layout
          <div className="mx-auto max-w-md">
            {attendanceData.map((attendee, index) => (
              <div key={index} className="bg-[#EAD196] flex justify-between p-5 mb-5 rounded-lg shadow-md">
                <div className="text-left">
                  <h3 className="text-xl font-bold text-gray-800">{attendee.assisstant_code}</h3>
                  <p className="text-lg text-gray-600">{attendee.name}</p>
                </div>
                <div className="flex items-center">
                  <div className="bg-red-800 text-[#EAD196] rounded-lg p-2 flex items-center justify-center shadow-md w-20 h-15 text-xl text-center">
                    {attendee.totalAttendance}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        <div className="flex justify-center items-center my-5">
          {currentPage > 1 && (
            <button onClick={handlePreviousPage} className="bg-red-800 text-[#EAD196] p-2 rounded-full mx-2 text-xl transition-colors hover:bg-red-700">
              ◀
            </button>
          )}
          <button className="bg-red-800 text-[#EAD196] p-3 rounded-full mx-2 text-xl font-bold" disabled>
            PAGE {currentPage}
          </button>
          {currentPage < totalPages && (
            <button onClick={handleNextPage} className="bg-red-800 text-[#EAD196] p-2 rounded-full mx-2 text-xl transition-colors hover:bg-red-700">
              ▶
            </button>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Recap;
