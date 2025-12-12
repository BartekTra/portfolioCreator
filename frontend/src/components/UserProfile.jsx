import React from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { Edit, ArrowLeft } from "lucide-react";

function UserProfile() {
  const navigate = useNavigate();
  const { user } = useUser();

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <p className="text-gray-600 dark:text-gray-300">Ładowanie profilu...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button
        onClick={() => navigate("/")}
        className="mb-6 flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
      >
        <ArrowLeft size={20} />
        <span>Wróć</span>
      </button>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-4">
                Mój profil
              </h1>
            </div>
            <button
              onClick={() => navigate("/profile/edit")}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
            >
              <Edit size={20} />
              <span>Edytuj profil</span>
            </button>
          </div>

          <div className="space-y-6">
            {/* Avatar */}
            <div className="flex justify-center">
              <div className="relative">
                <img
                  src={user.avatar_url || `https://ui-avatars.com/api/?name=${user.first_name}+${user.surname}&background=3b82f6&color=fff`}
                  alt={`${user.nickname} avatar`}
                  className="w-32 h-32 rounded-full object-cover border-4 border-gray-200 dark:border-gray-600"
                  onError={(e) => {
                    e.target.src = `https://ui-avatars.com/api/?name=${user.first_name}+${user.surname}&background=3b82f6&color=fff`;
                  }}
                />
              </div>
            </div>

            {/* Dane użytkownika */}
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                  Imię
                </h3>
                <p className="text-gray-800 dark:text-gray-200 text-lg">
                  {user.first_name || "Nie podano"}
                </p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                  Nazwisko
                </h3>
                <p className="text-gray-800 dark:text-gray-200 text-lg">
                  {user.surname || "Nie podano"}
                </p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                  Nickname
                </h3>
                <p className="text-gray-800 dark:text-gray-200 text-lg">
                  {user.nickname || "Nie podano"}
                </p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                  Email
                </h3>
                <p className="text-gray-800 dark:text-gray-200 text-lg">
                  {user.email || "Nie podano"}
                </p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                  Data rejestracji
                </h3>
                <p className="text-gray-800 dark:text-gray-200 text-lg">
                  {user.created_at ? new Date(user.created_at).toLocaleDateString("pl-PL") : "Nie podano"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserProfile;

