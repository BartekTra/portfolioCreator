import React from "react";
import { useState } from "react";
import { useRef } from "react";
import api from "../axios";
const RegisterSecondStage = (chosenEmail, chosenPassword) => {
  console.log(chosenEmail.chosenEmail);
  const [formData, setFormData] = useState({
    email: chosenEmail.chosenEmail,
    password: chosenEmail.chosenPassword,
    nickname: "",
    firstName: "",
    surname: "",
  });
  const [selectedImage, setSelectedImage] = useState(null);

  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = (e) => {
    e.preventDefault();
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
    }
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  const formDataToSend = new FormData();
  formDataToSend.append("email", formData.email);
  formDataToSend.append("password", formData.password);
  formDataToSend.append("password_confirmation", formData.password);
  formDataToSend.append("first_name", formData.firstName);
  formDataToSend.append("surname", formData.surname);
  formDataToSend.append("nickname", formData.nickname);

  if (selectedImage) {
    formDataToSend.append("avatar", selectedImage);
  }

  try {
    const response = await api.post(
      "http://localhost:3000/api/v1/auth",
      formDataToSend,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    const data = response.data;

    if (data.status === "success") {
      localStorage.setItem("access-token", data.tokens["access-token"]);
      localStorage.setItem("client", data.tokens.client);
      localStorage.setItem(
        "authorization",
        data.tokens.authorization.replace("Bearer ", "")
      );
      window.location.reload();
    }
  } catch (err) {
    console.error("Błąd przy wysyłaniu danych:", err.response?.data || err);
  }
};

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 space-y-6">
          <div className="text-center">
            <div className="mx-auto h-12 w-12 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center mb-4">
              <svg
                className="h-6 w-6 text-indigo-600 dark:text-indigo-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              Dokończ rejestrację
            </h2>
            <p className="text-gray-600 dark:text-gray-300">Uzupełnij resztę swoich danych!</p>
          </div>

          <form className="space-y-6">
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Nazwa użytkownika
              </label>
              <input
                type="nickname"
                id="nickname"
                name="nickname"
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 text-gray-900 dark:text-gray-100 dark:bg-gray-700 placeholder-gray-500 dark:placeholder-gray-400"
                placeholder="Podaj Nazwę Użytkownika"
              />
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Imię
              </label>
              <input
                id="firstName"
                name="firstName"
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 text-gray-900 dark:text-gray-100 dark:bg-gray-700 placeholder-gray-500 dark:placeholder-gray-400"
                placeholder="Twoje Imię"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Nazwisko
              </label>
              <input
                name="surname"
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 text-gray-900 dark:text-gray-100 dark:bg-gray-700 placeholder-gray-500 dark:placeholder-gray-400"
                placeholder="Twoje Nazwisko"
              />
            </div>

            <div>
              <label
                htmlFor="image"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Wybierz zdjęcie profilowe!
              </label>
              <label className="text-gray-500 dark:text-gray-400 text-xs mb-4 block">
                (lub pomiń, jeżeli chcesz to zrobić później)
              </label>

              {selectedImage ? (
                <div>
                  <label className="text-xs block mb-2 text-gray-500 dark:text-gray-400">Podgląd:</label>{" "}
                  {/* Etykieta w normalnym przepływie */}
                  <div className="relative w-[150px] h-[150px] rounded-2xl group">
                    <img
                      src={URL.createObjectURL(selectedImage)}
                      alt="Podgląd"
                      className="w-full h-full rounded-2xl object-cover cursor-pointer transition-opacity duration-300 group-hover:opacity-50"
                      onClick={handleImageClick}
                    />
                    <div
                      className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-2xl opacity-0 group-hover:opacity-50 transition-opacity duration-300 cursor-pointer"
                      onClick={handleImageClick}
                    >
                      <span className="text-white text-sm font-semibold">
                        Zmień zdjęcie
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <label className="w-full">
                  <input
                    type="file"
                    id="file-upload"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 text-gray-900 dark:text-gray-100 dark:bg-gray-700 placeholder-gray-500 dark:placeholder-gray-400"
                  />
                </label>
              )}

              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageChange}
                style={{ display: "none" }}
                accept="image/*"
              />
            </div>

            <button
              type="submit"
              onClick={handleSubmit}
              className={`w-full flex justify-center py-3 px-4 border rounded-lg text-sm font-medium text-white transition-all duration-200 bg-indigo-600 dark:bg-indigo-500 hover:bg-indigo-700 dark:hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-800 focus:ring-indigo-500 hover:shadow-lg transform hover:-translate-y-0.5"
              }`}
            >
              "Zarejestruj się"
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterSecondStage;
