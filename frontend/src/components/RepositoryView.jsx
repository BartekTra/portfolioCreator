import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../axios";
import ProjectTemplateRenderer from "./ProjectTemplateRenderer";
import MainPage from "./MainPage";
import { ArrowLeft, Edit, Trash2 } from "lucide-react";

function RepositoryView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [repository, setRepository] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [enlargedImage, setEnlargedImage] = useState(null);

  useEffect(() => {
    fetchRepository();
  }, [id]);

  // Obsługa Escape do zamykania powiększonego zdjęcia
  useEffect(() => {
    if (!enlargedImage) return;

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setEnlargedImage(null);
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, [enlargedImage]);

  const fetchRepository = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/repositories/${id}`);
      setRepository(response.data);
      
      // Pobierz pełne dane projektów
      const projectPromises = response.data.project_ids.map((projectId) =>
        api.get(`/projects/${projectId}`)
      );
      const projectResponses = await Promise.all(projectPromises);
      setProjects(projectResponses.map((res) => res.data));
    } catch (err) {
      console.error("Error fetching repository:", err);
      setError("Nie udało się załadować repozytorium");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Czy na pewno chcesz usunąć to repozytorium?")) {
      return;
    }

    try {
      await api.delete(`/repositories/${id}`);
      navigate("/repositories");
    } catch (err) {
      console.error("Error deleting repository:", err);
      alert("Nie udało się usunąć repozytorium");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <p className="text-gray-600 dark:text-gray-300">Ładowanie repozytorium...</p>
      </div>
    );
  }

  if (error || !repository) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400 mb-4">
            {error || "Repozytorium nie zostało znalezione"}
          </p>
          <button
            onClick={() => navigate("/repositories")}
            className="px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600"
          >
            Wróć do listy repozytoriów
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <MainPage />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => navigate("/repositories")}
          className="mb-6 flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
        >
          <ArrowLeft size={20} />
          <span>Wróć do listy repozytoriów</span>
        </button>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          <div className="p-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">
                  {repository.name}
                </h1>
                {repository.description && (
                  <p className="text-gray-600 dark:text-gray-300 mb-2">
                    {repository.description}
                  </p>
                )}
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  Utworzono: {new Date(repository.created_at).toLocaleDateString("pl-PL")}
                </p>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  Projekty: {repository.project_count}
                </p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => navigate(`/repositories/${id}/edit`)}
                  className="p-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600"
                  title="Edytuj"
                >
                  <Edit size={20} />
                </button>
                <button
                  onClick={handleDelete}
                  className="p-2 bg-red-600 dark:bg-red-500 text-white rounded-lg hover:bg-red-700 dark:hover:bg-red-600"
                  title="Usuń"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>

            {/* Projekty w repozytorium */}
            {projects.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 dark:text-gray-400">
                  To repozytorium nie zawiera żadnych projektów.
                </p>
              </div>
            ) : (
              <div className="space-y-12">
                {projects.map((project, index) => (
                  <div key={project.id} className="border-b border-gray-200 dark:border-gray-700 pb-12 last:border-b-0 last:pb-0">
                    <div className="mb-4">
                      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-2">
                        Projekt {index + 1}
                      </h2>
                      <button
                        onClick={() => navigate(`/projects/${project.id}`)}
                        className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        Zobacz szczegóły →
                      </button>
                    </div>
                    <ProjectTemplateRenderer
                      project={project}
                      onImageClick={(imageUrl) => setEnlargedImage(imageUrl)}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal do powiększania zdjęć */}
      {enlargedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          onClick={() => setEnlargedImage(null)}
        >
          <button
            onClick={() => setEnlargedImage(null)}
            className="fixed top-4 right-4 z-10 rounded-full bg-white/90 p-2 text-gray-800 shadow-lg transition hover:bg-white dark:bg-gray-900/90 dark:text-gray-100"
            aria-label="Zamknij"
          >
            <X size={24} />
          </button>
          <img
            src={enlargedImage}
            alt="Powiększone zdjęcie"
            className="max-w-[90vw] max-h-[90vh] object-contain rounded-lg shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}

export default RepositoryView;

