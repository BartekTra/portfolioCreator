import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useSearchParams } from "react-router-dom";
import api from "../axios";
import { ArrowLeft, Lock } from "lucide-react";

function ResetPasswordPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [formData, setFormData] = useState({
    password: "",
    password_confirmation: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const resetPasswordToken = searchParams.get("reset_password_token");
  const email = searchParams.get("email");

  useEffect(() => {
    if (!resetPasswordToken || !email) {
      setError(t("errors.generic"));
    }
  }, [resetPasswordToken, email]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    if (formData.password !== formData.password_confirmation) {
      setError(t("auth.resetPassword.passwordMismatch", "Hasła nie są identyczne"));
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError(t("auth.resetPassword.passwordTooShort", "Hasło musi mieć co najmniej 6 znaków"));
      setLoading(false);
      return;
    }

    try {
      await api.put("/auth/password", {
        password: formData.password,
        password_confirmation: formData.password_confirmation,
        reset_password_token: resetPasswordToken,
        email: email,
      });

      setSuccess(true);
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      console.error("Error resetting password:", err);
      const errorData = err.response?.data;
      let errorMessage = t("errors.generic");

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

  if (!resetPasswordToken || !email) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full">
          <div className="p-4 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 dark:border-red-400 rounded-lg">
            <p className="text-red-700 dark:text-red-400">
              {t("errors.generic")}
            </p>
          </div>
          <button
            onClick={() => navigate("/forgot-password")}
            className="mt-4 w-full py-2 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
          >
            {t("common.back")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <button
            onClick={() => navigate("/login")}
            className="mb-6 flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
          >
            <ArrowLeft size={20} />
            <span>{t("auth.forgotPassword.backToLogin")}</span>
          </button>

          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            {t("auth.resetPassword.title")}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            {t("auth.resetPassword.subtitle", { defaultValue: "Wprowadź nowe hasło dla konta:" })} <strong>{email}</strong>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 dark:border-red-400 rounded-lg">
              <p className="text-red-700 dark:text-red-400 text-sm">{error}</p>
            </div>
          )}

          {success && (
            <div className="p-4 bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500 dark:border-green-400 rounded-lg">
              <p className="text-green-700 dark:text-green-400 text-sm">
                Hasło zostało pomyślnie zmienione. Przekierowujemy do strony logowania...
              </p>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {t("auth.resetPassword.password")}
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100 sm:text-sm"
                  placeholder="Minimum 6 znaków"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {t("auth.resetPassword.passwordConfirmation")}
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password_confirmation"
                  name="password_confirmation"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={formData.password_confirmation}
                  onChange={handleChange}
                  className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100 sm:text-sm"
                  placeholder="Powtórz hasło"
                />
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading || success}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-blue-500 dark:hover:bg-blue-600"
            >
              {loading ? t("common.loading") : t("auth.resetPassword.submit")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ResetPasswordPage;

