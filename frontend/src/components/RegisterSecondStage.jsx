import React from "react";
import { useState } from "react";
import { useRef } from "react";
import { REGISTER_USER } from "../graphql/mutations/users/registerUser";
import { useMutation } from "@apollo/client/react";
const RegisterSecondStage = (chosenEmail, chosenPassword) => {
  console.log(chosenEmail, chosenPassword);
  const [formData, setFormData] = useState({
    email: chosenEmail,
    password: chosenPassword,
    nickname: "",
    firstName: "",
    surname: "",
  });
  const [selectedImage, setSelectedImage] = useState(null);

  const [registerUser, {loading, error, data}] = useMutation(REGISTER_USER);

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

  const handleSubmit = (e) => {
    e.preventDefault();
    
  }


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
          <div className="text-center">
            <div className="mx-auto h-12 w-12 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
              <svg
                className="h-6 w-6 text-indigo-600"
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
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Dokończ rejestrację
            </h2>
            <p className="text-gray-600">Uzupełnij resztę swoich danych!</p>
          </div>

          <form className="space-y-6">
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Nazwa użytkownika
              </label>
              <input
                type="nickname"
                id="nickname"
                name="nickname"
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 text-gray-900 placeholder-gray-500"
                placeholder="Podaj Nazwę Użytkownika"
              />
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Imię
              </label>
              <input
                id="firstName"
                name="firstName"
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 text-gray-900 placeholder-gray-500"
                placeholder="Twoje Imię"
              />
            </div>

            <div>
              <label
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Nazwisko
              </label>
              <input
                name="surname"
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 text-gray-900 placeholder-gray-500"
                placeholder="Twoje Nazwisko"
              />
            </div>

            <div>
              <label
                htmlFor="image"
                className="block text-sm font-medium text-gray-700"
              >
                Wybierz zdjęcie profilowe!
              </label>
              <label className="text-gray-500 text-xs mb-4 block">
                (lub pomiń, jeżeli chcesz to zrobić później)
              </label>

              {selectedImage ? (
                <div>
                  <label className="text-xs block mb-2">Podgląd:</label>{" "}
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 text-gray-900 placeholder-gray-500"
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

            {/* <button
              type="submit"
              //disabled={loading}
              className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg text-sm font-medium text-white transition-all duration-200 ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 hover:shadow-lg transform hover:-translate-y-0.5"
              }`}
            >
              {loading ? (
                <div className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Rejestrowanie...
                </div>
              ) : (
                "Zarejestruj się"
              )}
            </button> */}
          </form>


        </div>
      </div>
    </div>
  );
};

export default RegisterSecondStage;
