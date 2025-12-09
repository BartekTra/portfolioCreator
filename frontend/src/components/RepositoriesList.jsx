import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../axios";
import { Plus, FolderKanban, Edit, Trash2, Eye } from "lucide-react";
import MainPage from "./MainPage";

function RepositoriesList() {
  const navigate = useNavigate();
  const [repositories, setRepositories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRepositories();
  }, []);

  const fetchRepositories = async () => {
    try {
      setLoading(true);
      const response = await api.get("/repositories");
      setRepositories(response.data);
    } catch (err) {
      console.error("Error fetching repositories:", err);
      setError("Nie udało się załadować repozytoriów");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Czy na pewno chcesz usunąć to repozytorium?")) {
      return;
    }

    try {
      await api.delete(`/repositories/${id}`);
      setRepositories((prev) => prev.filter((repo) => repo.id !== id));
    } catch (err) {
      console.error("Error deleting repository:", err);
      alert("Nie udało się usunąć repozytorium");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <p className="text-gray-600 dark:text-gray-300">Ładowanie repozytoriów...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
          <button
            onClick={fetchRepositories}
            className="px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600"
          >
            Spróbuj ponownie
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <MainPage />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Moje repozytoria</h1>
          <button
            onClick={() => navigate("/repositories/new")}
            className="flex items-center space-x-2 px-6 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
          >
            <Plus size={20} />
            <span>Dodaj repozytorium</span>
          </button>
        </div>

        {/* Lista repozytoriów */}
        {repositories.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-12 text-center">
            <FolderKanban size={64} className="mx-auto text-gray-400 dark:text-gray-500 mb-4" />
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Nie masz jeszcze żadnych repozytoriów.
            </p>
            <button
              onClick={() => navigate("/repositories/new")}
              className="px-6 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600"
            >
              Dodaj pierwsze repozytorium
            </button>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {repositories.map((repository) => (
              <div
                key={repository.id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">
                      {repository.name}
                    </h2>
                    {repository.description && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                        {repository.description}
                      </p>
                    )}
                    <p className="text-xs text-gray-500 dark:text-gray-500">
                      {repository.project_count} {repository.project_count === 1 ? "projekt" : "projektów"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-4">
                  <button
                    onClick={() => navigate(`/repositories/${repository.id}`)}
                    className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
                  >
                    <Eye size={18} />
                    <span>Zobacz</span>
                  </button>
                  <button
                    onClick={() => navigate(`/repositories/${repository.id}/edit`)}
                    className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
                    title="Edytuj"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(repository.id)}
                    className="px-4 py-2 bg-red-200 dark:bg-red-600 text-red-700 dark:text-red-200 rounded-lg hover:bg-red-300 dark:hover:bg-red-500 transition-colors"
                    title="Usuń"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default RepositoriesList;

