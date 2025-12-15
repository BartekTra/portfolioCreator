// src/components/Login.tsx
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useUser } from "../context/UserContext.jsx";
import api from "../axios.js";
import { useNavigate } from "react-router-dom";

const LoginPage = ({ onSwitchToRegister, onSwitchToMainPage }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { refetchUser } = useUser();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await api.post("/auth/sign_in", {
        email: formData.email,
        password: formData.password,
      });

      const data = await response.data;
      console.log(data);

      // zapis tokenów w localStorage
      const tokens = await data.tokens;
      console.log(tokens);
      if (tokens) {
        localStorage.setItem("access-token", data.tokens["access-token"]);
        localStorage.setItem("client", data.tokens.client);
        localStorage.setItem(
          "authorization",
          data.tokens.authorization.replace("Bearer ", "")
        );
        console.log("DONE");
        navigate("/");
      }

      // odświeżenie usera w kontekście
      await refetchUser();
    } catch (err) {
      console.error(err);
      setError(t("auth.login.error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
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
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              {t("auth.login.title")}
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              {t("auth.login.subtitle")}
            </p>
          </div>

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
                  <ul className="text-sm text-red-700 dark:text-red-400 space-y-1">
                    {error.stringify}
                  </ul>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                {t("auth.login.email")}
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 text-gray-900 dark:text-gray-100 dark:bg-gray-700 placeholder-gray-500 dark:placeholder-gray-400"
                placeholder={t("auth.login.email")}
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                {t("auth.login.password")}
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 text-gray-900 dark:text-gray-100 dark:bg-gray-700 placeholder-gray-500 dark:placeholder-gray-400"
                placeholder={t("auth.login.password")}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
                >
                  Zapamiętaj mnie
                </label>
              </div>

              <div className="text-sm">
                <button
                  type="button"
                  onClick={() => navigate("/forgot-password")}
                  className="font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 transition-colors duration-200"
                >
                  {t("auth.login.forgotPassword")}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg text-sm font-medium text-white transition-all duration-200 ${
                loading
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
              ) : (
                t("auth.login.submit")
              )}
            </button>
          </form>

          <div className="text-center">
            <p className="text-gray-600 dark:text-gray-300">
              {t("auth.login.noAccount")}{" "}
              <button
                type="button"
                onClick={() => navigate("/register")}
                className="font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 transition-colors duration-200 underline decoration-2 underline-offset-2 hover:decoration-indigo-500"
              >
                {t("auth.login.register")}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
