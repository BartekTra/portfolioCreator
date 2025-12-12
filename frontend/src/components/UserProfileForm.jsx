import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import api from "../axios";
import { ArrowLeft, Save } from "lucide-react";

function UserProfileForm() {
  const navigate = useNavigate();
  const { user, refetchUser } = useUser();
  const [formData, setFormData] = useState({
    first_name: "",
    surname: "",
    nickname: "",
    email: "",
  });
  const [avatar, setAvatar] = useState(null);
  const [existingAvatarUrl, setExistingAvatarUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user) {
      setFormData({
        first_name: user.first_name || "",
        surname: user.surname || "",
        nickname: user.nickname || "",
        email: user.email || "",
      });
      setExistingAvatarUrl(user.avatar_url);
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatar(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setExistingAvatarUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const submitData = new FormData();
      submitData.append("first_name", formData.first_name);
      submitData.append("surname", formData.surname);
      submitData.append("nickname", formData.nickname);
      submitData.append("email", formData.email);

      if (avatar) {
        submitData.append("avatar", avatar);
      }

      // DeviseTokenAuth używa PUT do aktualizacji
      await api.put("/auth", submitData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Odśwież dane użytkownika
      await refetchUser();
      navigate("/profile");
    } catch (err) {
      console.error("Error updating profile:", err);
      const errorData = err.response?.data;
      let errorMessage = "Nie udało się zaktualizować profilu";
      
      if (errorData?.errors) {
        if (Array.isArray(errorData.errors)) {
          errorMessage = errorData.errors.join(", ");
        } else if (errorData.errors.full_messages) {
          errorMessage = errorData.errors.full_messages.join(", ");
        } else if (typeof errorData.errors === "string") {
          errorMessage = errorData.errors;
        }
      } else if (errorData?.error) {
        errorMessage = errorData.error;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <p className="text-gray-600 dark:text-gray-300">Ładowanie...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button
        onClick={() => navigate("/profile")}
        className="mb-6 flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
      >
        <ArrowLeft size={20} />
        <span>Wróć do profilu</span>
      </button>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <div className="p-6">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6">
            Edytuj profil
          </h1>

          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 dark:border-red-400 rounded-lg">
              <p className="text-red-700 dark:text-red-400 font-medium">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Avatar */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Zdjęcie profilowe
              </label>
              <div className="flex items-center space-x-6">
                <div className="flex-shrink-0">
                  <img
                    src={
                      existingAvatarUrl ||
                      `https://ui-avatars.com/api/?name=${formData.first_name}+${formData.surname}&background=3b82f6&color=fff`
                    }
                    alt="Avatar"
                    className="w-24 h-24 rounded-full object-cover border-4 border-gray-200 dark:border-gray-600"
                    onError={(e) => {
                      e.target.src = `https://ui-avatars.com/api/?name=${formData.first_name}+${formData.surname}&background=3b82f6&color=fff`;
                    }}
                  />
                </div>
                <div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="block w-full text-sm text-gray-500 dark:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-blue-900/20 dark:file:text-blue-300"
                  />
                  <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                    PNG, JPG, GIF do 5MB
                  </p>
                </div>
              </div>
            </div>

            {/* Imię */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Imię *
              </label>
              <input
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100"
              />
            </div>

            {/* Nazwisko */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Nazwisko *
              </label>
              <input
                type="text"
                name="surname"
                value={formData.surname}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100"
              />
            </div>

            {/* Nickname */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Nickname *
              </label>
              <input
                type="text"
                name="nickname"
                value={formData.nickname}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100"
              />
            </div>

            {/* Przyciski */}
            <div className="flex space-x-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 flex items-center justify-center space-x-2 px-6 py-3 bg-blue-600 dark:bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Save size={20} />
                <span>{loading ? "Zapisywanie..." : "Zapisz zmiany"}</span>
              </button>
              <button
                type="button"
                onClick={() => navigate("/profile")}
                className="px-6 py-3 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 font-semibold rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-colors"
              >
                Anuluj
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default UserProfileForm;

