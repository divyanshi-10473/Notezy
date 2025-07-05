import React from 'react';
import logo from '../../assets/logo2.png';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Book, FileText, Lightbulb, Star, Users } from 'lucide-react';
import cutu from '../../assets/cutu.png'

const Home = () => {
  const navigate = useNavigate();
  return (
    <div
      className="min-h-screen flex flex-col bg-cover bg-center bg-no-repeat bg-orange-200"
      style={{ backgroundImage: `url('/assets/notes9.png')` }}
    >
      <div className="flex-grow bg-orange-50/10 backdrop-blur-sm">
      
<header className="w-full px-6 py-4 flex flex-col sm:flex-row items-center justify-between bg-transparent">
 
  <div className="flex justify-center sm:justify-start w-full sm:w-auto">
    <img
      src={logo}
      alt="Notezy Logo"
      className="h-20 object-contain drop-shadow-[0_0_4px_rgba(0,0,0,0.8)]"
    />
  </div>
  <div className="sm:flex flex-col sm:flex-row items-center gap-4 mt-4 sm:mt-0 w-full sm:w-auto justify-center sm:justify-end hidden">

          <button
            onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-8 py-3 text-lg rounded-full border border-white/30 hover:bg-white hover:text-black transition w-full sm:w-auto"
          >
            How It Works
          </button>
    <Button
      variant="outline"
      className="text-black bg-white/90 border-white hover:bg-white hover:text-black shadow-md w-full sm:w-auto"
      onClick={() => navigate("/auth/login")}
    >
      Login
    </Button>

    <Button
      className="bg-white text-black hover:bg-gray-200 shadow-md w-full sm:w-auto"
      onClick={() => navigate("/auth/register")}
    >
      Sign Up
    </Button>
  </div>
</header>

<div className="sm:hidden w-full flex justify-center mt-4">
  <img
    src={cutu}
    alt="Study illustration"
    className="w-3/4 max-w-xs drop-shadow-lg rounded-xl"
  />
</div>



        <main className="flex flex-col justify-center items-center px-6 md:px-24 sm:h-[calc(100vh-160px)] h-[400px]">
          <div className="max-w-xl text-white flex flex-col justify-center items-center">
            <h2
              className="text-center text-4xl md:text-6xl font-bold mb-4"
              style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.3)' }}
            >
              Welcome to Notezy
            </h2>
            <p
              className="text-center text-lg md:text-xl mb-6 text-slate-700"
              style={{ textShadow: '1px 1px 3px rgba(0,0,0,0.2)' }}
            >
              Organize your study materials, upload and create notes, and stay productive like never before.
            </p>

            <Button className="bg-white text-black text-lg px-6 py-2 hover:bg-gray-200 shadow-lg" onClick={() => navigate('/auth/login')}>
              Get Started
            </Button>
          </div>
        </main>

        {/* How It Works Section */}
<section id="how-it-works"  className="bg-white/50 py-12 px-6 md:px-24">
  <h2 className="text-3xl md:text-4xl font-bold text-center text-black mb-10">
    How It Works
  </h2>
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
    {/* Step 1: Subjects */}
    <div className="bg-white shadow-lg rounded-2xl p-6 text-center hover:shadow-2xl transition">
      <Lightbulb className="mx-auto text-orange-500" size={40} />
      <h3 className="text-xl font-semibold mt-4 text-black">Create Subjects</h3>
      <p className="text-gray-600 mt-2">Start by creating subjects to organize your learning.</p>
    </div>

    {/* Step 2: Chapters */}
    <div className="bg-white shadow-lg rounded-2xl p-6 text-center hover:shadow-2xl transition">
      <Book className="mx-auto text-blue-500" size={40} />
      <h3 className="text-xl font-semibold mt-4 text-black">Add Chapters</h3>
      <p className="text-gray-600 mt-2">Break down subjects into chapters and mark them as completed to track your progress.</p>
    </div>

    {/* Step 3: Notes */}
    <div className="bg-white shadow-lg rounded-2xl p-6 text-center hover:shadow-2xl transition">
      <FileText className="mx-auto text-green-500" size={40} />
      <h3 className="text-xl font-semibold mt-4 text-black">Upload or Create Notes</h3>
      <p className="text-gray-600 mt-2">Add notes using typing, voice, or PDF uploads for each chapter.</p>
    </div>

    {/* Step 4: Favorites */}
    <div className="bg-white shadow-lg rounded-2xl p-6 text-center hover:shadow-2xl transition">
      <Star className="mx-auto text-yellow-500" size={40} />
      <h3 className="text-xl font-semibold mt-4 text-black">Mark Favorites</h3>
      <p className="text-gray-600 mt-2">Quickly find important notes by marking them as favorite.</p>
    </div>

    {/* Step 5: Chatbot */}
    <div className="bg-white shadow-lg rounded-2xl p-6 text-center hover:shadow-2xl transition">
      <Users className="mx-auto text-purple-500" size={40} />
      <h3 className="text-xl font-semibold mt-4 text-black">AI Chatbot for Doubts</h3>
      <p className="text-gray-600 mt-2">Use our built-in chatbot to ask questions and get instant study help.</p>
    </div>

    {/* Step 6: Progress Tracking */}
    <div className="bg-white shadow-lg rounded-2xl p-6 text-center hover:shadow-2xl transition">
      <svg className="mx-auto text-teal-600" xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m5 1a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <h3 className="text-xl font-semibold mt-4 text-black">Track Your Progress</h3>
      <p className="text-gray-600 mt-2">Visualize chapter completion and stay on top of your subjects.</p>
    </div>
  </div>
</section>

      </div>

      {/* Footer */}
      <footer className="bg-white/5 text-black text-center py-4">
        © 2025 Divyanshi. All rights reserved.
      </footer>
    </div>
  );
};

export default Home;
