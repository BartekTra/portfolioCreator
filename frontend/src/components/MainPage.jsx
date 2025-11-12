import React from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { Home, User, Settings, FolderKanban } from 'lucide-react';

function MainPage() {
  const navigate = useNavigate();
  const { user, loading: loadingUser } = useUser();

  if (loadingUser) return <p className="flex items-center justify-center h-screen text-gray-600">Ładowanie...</p>;
  
  if (!user) return <p className="flex items-center justify-center h-screen text-gray-600">Ładowanie danych użytkownika...</p>;

  return (
    <div className="min-h-20 bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Lewa strona - przyciski */}
            <div className="flex items-center space-x-4">
              <button onClick={() => navigate("/")} className="flex items-center space-x-2 px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors duration-200">
                <Home size={20} />
                <span className="font-medium">Strona główna</span>
              </button>
              
              <button className="flex items-center space-x-2 px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors duration-200">
                <User size={20} />
                <span className="font-medium">Profil</span>
              </button>
              
              <button className="flex items-center space-x-2 px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors duration-200">
                <Settings size={20} />
                <span className="font-medium">Ustawienia</span>
              </button>
              
              <button 
                onClick={() => navigate("/projects")}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors duration-200"
              >
                <FolderKanban size={20} />
                <span className="font-medium">Projekty</span>
              </button>
            </div>

            {/* Prawa strona - dane użytkownika */}
            <div className="flex items-center space-x-3">
              <span className="text-gray-700 font-medium">{user.nickname}</span>
              <img 
                src={user.avatar_url} 
                alt={`${user.nickname} avatar`}
                className="w-15 h-15 rounded-full object-cover border-2 border-gray-200 hover:border-blue-500 transition-colors duration-200 cursor-pointer"
                onError={(e) => {
                  e.target.src = `https://ui-avatars.com/api/?name=${user.first_name}+${user.surname}&background=3b82f6&color=fff`;
                }}
              />
            </div>
          </div>
        </div>
      </nav>


      
    </div>
  );
}

export default MainPage;
