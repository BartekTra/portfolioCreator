import React from "react";
import { useState } from "react";
import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import api from "../axios";

const RegisterSecondStage = (chosenEmail, chosenPassword) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  console.log(chosenEmail.chosenEmail);
  const [formData, setFormData] = useState({
    email: chosenEmail.chosenEmail,
    password: chosenEmail.chosenPassword,
    nickname: "",
    firstName: "",
    surname: "",
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

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
  setLoading(true);
  setError(null);
  setSuccess(false);

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
      if (data.data?.confirmed === false || data.message) {
        setSuccess(true);
      } else {
        navigate("/login");
      }
    }
  } catch (err) {
    console.error("Błąd przy wysyłaniu danych:", err.response?.data || err);
    const errorMessage = err.response?.data?.errors?.join(", ") || 
                         err.response?.data?.error || 
                         err.response?.data?.message ||
                         t("auth.register.error");
    setError(errorMessage);
  } finally {
    setLoading(false);
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

          {success && (
            <div className="bg-green-50 dark:bg-green-900/20 border-l-4 border-green-400 dark:border-green-500 p-4 rounded-md">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-green-400 dark:text-green-500"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-green-800 dark:text-green-200 mb-1">
                    {t("auth.register.success")}
                  </p>
                  <p className="text-sm text-green-700 dark:text-green-300">
                    {t("auth.register.confirmationRequired")}
                  </p>
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-400 dark:border-red-500 p-4 rounded-md">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-red-400 dark:text-red-500"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700 dark:text-red-400">
                    {error}
                  </p>
                </div>
              </div>
            </div>
          )}

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
              disabled={loading || success}
              className={`w-full flex justify-center py-3 px-4 border rounded-lg text-sm font-medium text-white transition-all duration-200 ${
                loading || success
                  ? "bg-gray-400 dark:bg-gray-600 cursor-not-allowed"
                  : "bg-indigo-600 dark:bg-indigo-500 hover:bg-indigo-700 dark:hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-800 focus:ring-indigo-500 hover:shadow-lg transform hover:-translate-y-0.5"
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
                  {t("common.loading")}
                </div>
              ) : success ? (
                t("auth.register.success")
              ) : (
                t("auth.register.submit")
              )}
            </button>

            {success && (
              <div className="text-center">
                <button
                  type="button"
                  onClick={() => navigate("/login")}
                  className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 transition-colors duration-200 underline decoration-2 underline-offset-2 hover:decoration-indigo-500"
                >
                  {t("auth.register.login")}
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterSecondStage;
