import React from 'react';
import bg4 from '../../assets/notes9.png';
import logo from '../../assets/logo2.png';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();
  return (
    <div
      className="min-h-screen flex flex-col bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${bg4})` }}
    >
      <div className="flex-grow bg-orange-50/10 backdrop-blur-sm">
        {/* Header */}
        <header className="flex flex-col gap-2 md:flex-row justify-between items-center px-6 py-4">
          <div className="flex items-center space-x-2">
            <img src={logo} alt="Notezy Logo" className="w-50 h-20 drop-shadow-[0_0_1px_rgba(0,0,0,1)]" />
          </div>
          <div className="space-x-4 flex">
            <Button variant="outline" className="text-black border-white hover:bg-white/70 shadow-lg" onClick={() => navigate('/auth/login')}>
              Login
            </Button>
            <Button className="bg-white text-black hover:bg-gray-200 shadow-lg" onClick={() => navigate('/auth/register')}>
              Sign Up
            </Button>
          </div>
        </header>

        {/* Hero Section */}
        <main className="flex flex-col justify-center items-center px-6 md:px-24 h-[calc(100vh-160px)]">
          <div className="max-w-xl text-white flex flex-col justify-center items-center">
            <h2
              className="text-center text-4xl md:text-6xl font-bold mb-4"
              style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.3)' }}
            >
              Welcome to Notezy
            </h2>
            <p
              className="text-center text-lg md:text-xl mb-6"
              style={{ textShadow: '1px 1px 3px rgba(0,0,0,0.2)' }}
            >
              Organize your study materials, upload and create notes, and stay productive like never before.
            </p>

            <Button className="bg-white text-black text-lg px-6 py-2 hover:bg-gray-200 shadow-lg" onClick={() => navigate('/auth/login')}>
              Get Started
            </Button>
          </div>
        </main>
      </div>

      {/* Footer */}
      <footer className="bg-white/60 text-black text-center py-4">
        © 2025 Divyanshi. All rights reserved.
      </footer>
    </div>
  );
};

export default Home;
