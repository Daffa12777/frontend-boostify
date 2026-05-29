import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import HomeNav from '../components/HomeNav';
import Footer from '../components/Footer';
import { useTheme } from '../styles/ThemeContext';

type AttendanceItem = {
  time: string;
  rawTime: string;
};

const formatTime = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
};

const Profile: React.FC = () => {
  const [profileData, setProfileData] = useState<{ id: number; name: string; assisstant_code: string; image_url: string } | null>(null);
  const [attendanceData, setAttendanceData] = useState<AttendanceItem[]>([]);
  const { isDarkMode } = useTheme();
  const [profileImage, setProfileImage] = useState<string>('/user.png');
  const [showModal, setShowModal] = useState<boolean>(false);

  const fetchUserData = async () => {
    const authDataString = localStorage.getItem('authData');
    if (authDataString) {
      try {
        const authData = JSON.parse(authDataString);
        const token = authData.token.token;

        const response = await fetch('https://boostify-back-end.vercel.app/api/whoami', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        setProfileData(data);
        setProfileImage(data.image_url || '/user.png');
      } catch (error: any) {
        console.error('Failed to fetch user data:', error.message);
      }
    }
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/heic'];
      if (!allowedTypes.includes(file.type)) {
        alert('Only JPG, JPEG, PNG, and HEIC formats are allowed.');
        return;
      }

      const authDataString = localStorage.getItem('authData');
      if (authDataString) {
        try {
          const authData = JSON.parse(authDataString);
          const token = authData.token.token;

          const formData = new FormData();
          formData.append('image', file);

          const response = await fetch('https://boostify-back-end.vercel.app/api/uploadImage', {
            method: 'PATCH',
            headers: {
              Authorization: `Bearer ${token}`,
            },
            body: formData,
          });

          if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Failed to upload image: ${response.status} ${errorText}`);
          }

          const data = await response.json();
          const updatedImageUrl = data.updatedUser.imageUrl;

          setProfileData((prevState) => {
            if (!prevState) return null;
            return {
              ...prevState,
              image_url: updatedImageUrl,
            };
          });
          setProfileImage(updatedImageUrl);
        } catch (error: any) {
          console.error('Failed to upload image:', error.message);
        }
      }
    }
  };

  const handleDeleteImage = async () => {
    const authDataString = localStorage.getItem('authData');
    if (authDataString) {
      try {
        const authData = JSON.parse(authDataString);
        const token = authData.token.token;

        const response = await fetch('https://boostify-back-end.vercel.app/api/deleteImage', {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to delete image');
        }

        setProfileImage('/user.png');
        setProfileData((prevState) => {
          if (!prevState) return null;
          return {
            ...prevState,
            image_url: '/user.png',
          };
        });
        setShowModal(false);
      } catch (error: any) {
        console.error('Failed to delete image:', error.message);
      }
    }
  };

  const fetchAttendanceData = async () => {
    const authDataString = localStorage.getItem('authData');
    if (authDataString) {
      try {
        const authData = JSON.parse(authDataString);
        const token = authData.token.token;

        console.log('Fetching attendance data with token:', token);

        const response = await fetch('https://boostify-back-end.vercel.app/api/personalrec', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          if (response.status === 404) {
            setAttendanceData([]);
          } else {
            const errorText = await response.text();
            throw new Error(`Network response was not ok: ${response.status} ${errorText}`);
          }
        } else {
          const data = await response.json();
          console.log('Attendance data received:', data);
          setAttendanceData(data.attendancesTime || []);
        }
      } catch (error: any) {
        console.error('Failed to fetch attendance data:', error.message);
      }
    }
  };

  useEffect(() => {
    fetchUserData();
    fetchAttendanceData();
  }, []);

  return (
    <div className={`max-w-7xl mx-auto ${isDarkMode ? 'bg-[#0D0D0D] text-white' : 'bg-white text-black'}`}>
      <HomeNav />
      <main className="px-4 py-10">
        <div className={`flex flex-col items-center mb-10 ${isDarkMode ? 'text-white' : 'text-black'}`}>
          <div className="relative flex flex-col items-center">
            <div className="bg-yellow-100 w-36 h-36 sm:w-48 sm:h-48 rounded-full flex items-center justify-center overflow-hidden mt-8 sm:mt-12">
              <Image
                src={profileImage}
                alt="User Avatar"
                width={100}
                height={100}
                className="object-cover w-full h-full"
              />
            </div>
            <Image
              src={isDarkMode ? "/pencil-dark.png" : "/pencil-light.png"}
              alt="Edit Profile"
              width={40}
              height={40}
              className="absolute bottom-4 right-0 cursor-pointer sm:w-10 sm:h-10 aspect-square"
              onClick={() => setShowModal(true)}
            />
          </div>
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-700 my-4 sm:my-5">
            {profileData?.assisstant_code || 'N/A'}
          </h2>
          <h1 className="text-lg sm:text-2xl md:text-3xl font-bold text-gray-800">
            {profileData?.name || 'Loading...'}
          </h1>
        </div>
        <section className="mt-8 sm:mt-12">
          <h2 className="font-bold text-xl sm:text-2xl mb-6 sm:mb-8">Attendance History</h2>
          {attendanceData.length > 0 ? (
            attendanceData.map((item: AttendanceItem, index: number) => (
              <div key={index} className="flex justify-between py-2 border-b text-base sm:text-lg font-bold">
                <span className="flex-1">{item.time}</span>
                <span className="flex-1 text-right">{formatTime(item.rawTime)}</span>
              </div>
            ))
          ) : (
            <p className="text-base sm:text-lg text-gray-600">No attendance history available</p>
          )}
        </section>
      </main>

      {showModal && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 sm:p-5 rounded-lg text-center w-56 sm:w-64 relative">
            <button className="absolute top-2 right-2 text-lg font-bold text-gray-700" onClick={() => setShowModal(false)}>
              &times;
            </button>
            <h3 className="mb-2 text-base sm:text-lg font-bold text-gray-800">Edit Profile Picture</h3>
            <label className="inline-block py-1 px-2 bg-[#D7B66A] text-[#7D0A0A] rounded cursor-pointer mb-2">
              <input
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/heic"
                onChange={handleFileChange}
                className="hidden"
              />
              Choose File
            </label>
            <div className="flex justify-between mt-4">
              <button className="py-1 px-3 bg-[#7D0A0A] text-[#D7B66A] rounded font-bold" onClick={handleDeleteImage}>
                Delete Image
              </button>
              <button className="py-1 px-3 bg-[#D7B66A] text-[#7D0A0A] rounded font-bold" onClick={() => setShowModal(false)}>
                Upload
              </button>
            </div>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
};

export default Profile;