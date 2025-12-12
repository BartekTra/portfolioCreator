import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../axios";
import TitlePageTemplateRenderer from "./TitlePageTemplateRenderer";
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

            <TitlePageTemplateRenderer titlePage={titlePage} />
          </div>
        </div>
      </div>
  );
}

export default TitlePageView;

