import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import api from "../axios";
import { Plus, Edit, Trash2, Eye } from "lucide-react";

function TitlePageList() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [titlePages, setTitlePages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTitlePages();
  }, []);

  const fetchTitlePages = async () => {
    try {
      setLoading(true);
      const response = await api.get("/title_pages");
      setTitlePages(response.data);
    } catch (err) {
      console.error("Error fetching title pages:", err);
      setError(t("titlePages.list.errorLoading"));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm(t("titlePages.list.deleteConfirm"))) {
      return;
    }

    try {
      await api.delete(`/title_pages/${id}`);
      setTitlePages((prev) => prev.filter((page) => page.id !== id));
    } catch (err) {
      console.error("Error deleting title page:", err);
      alert(t("titlePages.list.deleteError"));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <p className="text-gray-600 dark:text-gray-300">{t("titlePages.list.loading")}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
          <button
            onClick={fetchTitlePages}
            className="px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600"
          >
            {t("common.tryAgain")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">{t("titlePages.list.myTitlePages")}</h1>
          <button
            onClick={() => navigate("/title_pages/new")}
            className="flex items-center space-x-2 px-6 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
          >
            <Plus size={20} />
            <span>{t("titlePages.list.addTitlePage")}</span>
          </button>
        </div>

        {/* Lista stron tytułowych */}
        {titlePages.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-12 text-center">
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              {t("titlePages.list.noTitlePagesYet")}
            </p>
            <button
              onClick={() => navigate("/title_pages/new")}
              className="px-6 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600"
            >
              {t("titlePages.list.addFirstTitlePage")}
            </button>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {titlePages.map((titlePage) => (
              <div
                key={titlePage.id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    {titlePage.photo_url && (
                      <img
                        src={titlePage.photo_url}
                        alt={t("titlePages.list.profilePhoto")}
                        className="w-20 h-20 rounded-full object-cover mb-3"
                      />
                    )}
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">
                      {titlePage.email || t("titlePages.list.defaultTitle")}
                    </h2>
                    {titlePage.phone && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                        📞 {titlePage.phone}
                      </p>
                    )}
                    {titlePage.email && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                        ✉️ {titlePage.email}
                      </p>
                    )}
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                      {t("titlePages.view.template")}: {titlePage.template_key}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-4">
                  <button
                    onClick={() => navigate(`/title_pages/${titlePage.id}`)}
                    className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
                  >
                    <Eye size={18} />
                    <span>{t("titlePages.list.view")}</span>
                  </button>
                  <button
                    onClick={() => navigate(`/title_pages/${titlePage.id}/edit`)}
                    className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
                    title={t("common.edit")}
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(titlePage.id)}
                    className="px-4 py-2 bg-red-200 dark:bg-red-600 text-red-700 dark:text-red-200 rounded-lg hover:bg-red-300 dark:hover:bg-red-500 transition-colors"
                    title={t("common.delete")}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
  );
}

export default TitlePageList;

