import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../axios";
import MainPage from "./MainPage";
import { ArrowLeft, Edit } from "lucide-react";

function TitlePageView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [titlePage, setTitlePage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTitlePage();
  }, [id]);

  const fetchTitlePage = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/title_pages/${id}`);
      setTitlePage(response.data);
    } catch (err) {
      console.error("Error fetching title page:", err);
      setError("Nie udało się załadować strony tytułowej");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <p className="text-gray-600 dark:text-gray-300">Ładowanie strony tytułowej...</p>
      </div>
    );
  }

  if (error || !titlePage) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400 mb-4">
            {error || "Strona tytułowa nie została znaleziona"}
          </p>
          <button
            onClick={() => navigate("/title_pages")}
            className="px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600"
          >
            Wróć do listy stron tytułowych
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <MainPage />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => navigate("/title_pages")}
          className="mb-6 flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
        >
          <ArrowLeft size={20} />
          <span>Wróć do listy stron tytułowych</span>
        </button>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          <div className="p-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-4">
                  Strona tytułowa
                </h1>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  Template: {titlePage.template_key}
                </p>
              </div>
              <button
                onClick={() => navigate(`/title_pages/${id}/edit`)}
                className="p-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600"
                title="Edytuj"
              >
                <Edit size={20} />
              </button>
            </div>

            <div className="space-y-6">
              {titlePage.photo_url && (
                <div className="flex justify-center">
                  <img
                    src={titlePage.photo_url}
                    alt="Zdjęcie profilowe"
                    className="w-48 h-48 rounded-full object-cover border-4 border-gray-200 dark:border-gray-600"
                  />
                </div>
              )}

              <div className="grid gap-4 md:grid-cols-2">
                {titlePage.phone && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                      Telefon
                    </h3>
                    <p className="text-gray-800 dark:text-gray-200">{titlePage.phone}</p>
                  </div>
                )}
                {titlePage.email && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                      Email
                    </h3>
                    <p className="text-gray-800 dark:text-gray-200">{titlePage.email}</p>
                  </div>
                )}
              </div>

              {titlePage.address && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                    Adres
                  </h3>
                  <p className="text-gray-800 dark:text-gray-200">{titlePage.address}</p>
                </div>
              )}

              {titlePage.bio && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                    Opis
                  </h3>
                  <p className="text-gray-800 dark:text-gray-200 whitespace-pre-line">
                    {titlePage.bio}
                  </p>
                </div>
              )}

              {titlePage.experience && titlePage.experience.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
                    Doświadczenie zawodowe
                  </h3>
                  <div className="space-y-4">
                    {titlePage.experience.map((exp, index) => (
                      <div
                        key={index}
                        className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border-l-4 border-blue-500"
                      >
                        <h4 className="font-semibold text-gray-800 dark:text-gray-200">
                          {exp.position || "Stanowisko"}
                        </h4>
                        <p className="text-gray-600 dark:text-gray-300 mb-1">
                          {exp.company || "Firma"}
                        </p>
                        {exp.period && (
                          <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                            {exp.period}
                          </p>
                        )}
                        {exp.description && (
                          <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                            {exp.description}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TitlePageView;

