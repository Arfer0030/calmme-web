'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import TopBar from '@/components/TopBar';
import Sidebar from '@/components/Sidebar';
import Image from 'next/image';
import { useAuth } from '@/hooks/useAuth';
import { authService } from '@/services/auth';

const songs = [
  {
    title: 'Drift Into Dreams',
    image: '/images/song1.png',
    file: '/songs/song1.mp3',
  },
  {
    title: 'Moonlight Calm',
    image: '/images/song2.png',
    file: '/songs/song2.mp3',
  },
  {
    title: 'Whispers of the Forest',
    image: '/images/song3.png',
    file: '/songs/song3.mp3',
  },
  {
    title: 'Slow Frequency',
    image: '/images/song4.png',
    file: '/songs/song4.mp3',
  },
  {
    title: 'Rain on Leaves',
    image: '/images/song5.png',
    file: '/songs/song5.mp3',
  },
  {
    title: 'Echoes of the Earth',
    image: '/images/song6.png',
    file: '/songs/song6.mp3',
  },
];

export default function MeditatePage() {
  const router = useRouter();
  const audioRef = useRef(null);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false); // closed by default

  const { user, loading } = useAuth();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        try {
          const data = await authService.getCurrentUserData();
          setUserData(data);
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };

    fetchUserData();
  }, [user]);

  const currentSong = songs[currentSongIndex];

  const playNextSong = () => {
    setCurrentSongIndex((prevIndex) => (prevIndex + 1) % songs.length);
  };

  const handleTimeUpdate = () => {
    const audio = audioRef.current;
    setCurrentTime(audio.currentTime);
    if (audio.ended) {
      playNextSong();
    }
  };

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleNext = () => {
    playNextSong();
    setIsPlaying(false);
  };

  const formatTime = (time) => {
    const min = Math.floor(time / 60);
    const sec = Math.floor(time % 60).toString().padStart(2, '0');
    return `${min}:${sec}`;
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
    };

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.pause();
    };
  }, [currentSongIndex]);

  useEffect(() => {
    if (isPlaying) {
      audioRef.current.play();
    }
  }, [currentSongIndex]);

  return (
    <div className="flex h-screen">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        userData={userData}
      />

      <div className="flex flex-col flex-grow bg-gradient-to-br from-[#e0e9ff] to-[#f6e9ff]">
        <TopBar
          title="Meditate Time"
          onMenuClick={() => setSidebarOpen(true)}
          onBackClick={() => router.push('/home')}
          showBackButton={true}
          showMenuButton={true}
        />

        <div className="flex flex-grow p-6 gap-10 overflow-y-auto">
          <div className="w-1/2 flex flex-col items-center bg-[#d6bdfc] rounded-3xl p-6 shadow-lg">
            <h2 className="text-xl font-semibold text-center mb-4">{currentSong.title}</h2>
            <Image
              src={currentSong.image}
              width={200}
              height={200}
              className="rounded-full mb-4"
              alt={currentSong.title}
            />
            <audio ref={audioRef} src={currentSong.file} />
            <div className="w-full mt-4">
              <input
                type="range"
                min={0}
                max={duration}
                value={currentTime}
                onChange={(e) => {
                  const audio = audioRef.current;
                  const newTime = parseFloat(e.target.value);
                  audio.currentTime = newTime;
                  setCurrentTime(newTime);
                }}
                className="w-full accent-purple-700"
              />
              <div className="flex justify-between text-sm text-gray-600">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>
            <div className="mt-6 flex items-center gap-6">
              <button onClick={handleNext}>
                <img src="/icons/previous.png" width={30} alt="Prev" />
              </button>
              <button onClick={togglePlayPause}>
                <img
                  src={`/icons/${isPlaying ? 'pause' : 'play'}.png`}
                  width={40}
                  alt="PlayPause"
                />
              </button>
              <button onClick={handleNext}>
                <img src="/icons/next.png" width={30} alt="Next" />
              </button>
            </div>
          </div>

          <div className="w-1/2 bg-white rounded-3xl p-6 shadow-lg overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">Your Calm Picks</h3>
            <ul className="space-y-4">
              {songs.map((song, index) => (
                <li
                  key={index}
                  className={`flex items-center justify-between p-3 rounded-xl cursor-pointer ${
                    index === currentSongIndex ? 'bg-purple-200' : 'bg-gray-100'
                  }`}
                  onClick={() => {
                    setCurrentSongIndex(index);
                    setIsPlaying(true);
                  }}
                >
                  <div className="flex items-center gap-4">
                    <Image src={song.image} width={50} height={50} className="rounded-md" alt={song.title} />
                    <span className="font-medium">{song.title}</span>
                  </div>
                  <img
                    src={`/icons/${index === currentSongIndex && isPlaying ? 'pause' : 'play'}.png`}
                    width={20}
                    alt="Control"
                  />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
