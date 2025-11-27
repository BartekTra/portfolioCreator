import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../axios";
import { Plus, ChevronLeft, ChevronRight } from "lucide-react";
import MainPage from "./MainPage";
import ProjectView from "./ProjectView";

function ProjectsList() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    if (projects.length === 0) {
      setCurrentIndex(0);
      return;
    }
    setCurrentIndex((prev) => Math.min(prev, projects.length - 1));
  }, [projects.length]);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await api.get("/projects");
      setProjects(response.data);
    } catch (err) {
      console.error("Error fetching projects:", err);
      setError("Nie udało się załadować projektów");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Czy na pewno chcesz usunąć ten projekt?")) {
      return;
    }

    try {
      await api.delete(`/projects/${id}`);
      setProjects((prevProjects) => {
        const updatedProjects = prevProjects.filter((project) => project.id !== id);
        setCurrentIndex((prev) => {
          if (updatedProjects.length === 0) {
            return 0;
          }
          return Math.min(prev, updatedProjects.length - 1);
        });
        return updatedProjects;
      });
    } catch (err) {
      console.error("Error deleting project:", err);
      alert("Nie udało się usunąć projektu");
    }
  };

  const handleNext = () => {
    if (projects.length === 0) return;
    setCurrentIndex((prev) => (prev + 1) % projects.length);
  };

  const handlePrev = () => {
    if (projects.length === 0) return;
    setCurrentIndex((prev) => (prev - 1 + projects.length) % projects.length);
  };

  const getProjectTitle = (project) => {
    const sections = project.data?.sections || [];
    const titleSection = sections.find((section) => section.type === "title");
    return titleSection?.value || "Bez tytułu";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <p className="text-gray-600 dark:text-gray-300">Ładowanie projektów...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
          <button
            onClick={fetchProjects}
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Moje projekty</h1>
          <button
            onClick={() => navigate("/projects/new")}
            className="flex items-center space-x-2 px-6 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
          >
            <Plus size={20} />
            <span>Dodaj projekt</span>
          </button>
        </div>

        {/* Lista projektów */}
        {projects.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-12 text-center">
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Nie masz jeszcze żadnych projektów.
            </p>
            <button
              onClick={() => navigate("/projects/new")}
              className="px-6 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600"
            >
              Dodaj pierwszy projekt
            </button>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="relative">
              <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
                <div
                  className="flex transition-transform duration-500 ease-out"
                  style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                >
                  {projects.map((project) => (
                    <div key={project.id} className="w-full flex-shrink-0 px-2 sm:px-6">
                      <ProjectView project={project} />
                    </div>
                  ))}
                </div>
              </div>

              {projects.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={handlePrev}
                    className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/70 p-2 text-gray-800 shadow-lg transition hover:bg-white dark:bg-gray-900/80 dark:text-gray-100"
                  >
                    <ChevronLeft size={24} />
                  </button>
                  <button
                    type="button"
                    onClick={handleNext}
                    className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/70 p-2 text-gray-800 shadow-lg transition hover:bg-white dark:bg-gray-900/80 dark:text-gray-100"
                  >
                    <ChevronRight size={24} />
                  </button>
                </>
              )}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-wide text-gray-500 dark:text-gray-400">
                  Projekt {currentIndex + 1} / {projects.length}
                </p>
                <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
                  {getProjectTitle(projects[currentIndex])}
                </h2>
                <p className="text-gray-500 dark:text-gray-400">
                  Template: {projects[currentIndex]?.template_key || "Nieznany"}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => navigate(`/projects/${projects[currentIndex].id}`)}
                  className="rounded-lg border border-gray-300 px-4 py-2 text-gray-700 transition hover:bg-gray-100 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700"
                >
                  Szczegóły
                </button>
                <button
                  onClick={() => navigate(`/projects/${projects[currentIndex].id}/edit`)}
                  className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-2 text-blue-700 transition hover:bg-blue-100 dark:border-blue-500/40 dark:bg-blue-500/10 dark:text-blue-200"
                >
                  Edytuj
                </button>
                <button
                  onClick={() => handleDelete(projects[currentIndex].id)}
                  className="rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-red-700 transition hover:bg-red-100 dark:border-red-500/40 dark:bg-red-500/10 dark:text-red-300"
                >
                  Usuń
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProjectsList;

