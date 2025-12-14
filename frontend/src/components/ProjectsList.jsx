import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import api from "../axios";
import { Plus, ChevronLeft, ChevronRight, X } from "lucide-react";
import ProjectView from "./ProjectView";

function ProjectsList() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [enlargedImage, setEnlargedImage] = useState(null);

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
        const updatedProjects = prevProjects.filter(
          (project) => project.id !== id
        );
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

  const handleNext = useCallback(() => {
    if (projects.length === 0 || isTransitioning) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % projects.length);
      setTimeout(() => setIsTransitioning(false), 50);
    }, 250);
  }, [projects.length, isTransitioning]);

  const handlePrev = useCallback(() => {
    if (projects.length === 0 || isTransitioning) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + projects.length) % projects.length);
      setTimeout(() => setIsTransitioning(false), 50);
    }, 250);
  }, [projects.length, isTransitioning]);

  // Obsługa klawiatury - strzałki lewo/prawo
  useEffect(() => {
    if (projects.length <= 1) return;

    const handleKeyDown = (event) => {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        handlePrev();
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        handleNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [projects.length, handlePrev, handleNext]);

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

  const getProjectTitle = (project) => {
    const sections = project.data?.sections || [];
    const titleSection = sections.find((section) => section.type === "title");
    return titleSection?.value || "Bez tytułu";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <p className="text-gray-600 dark:text-gray-300">
          Ładowanie projektów...
        </p>
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
    <div className="w-full h-full flex flex-row overflow-hidden">
      {/* Lewa strzałka - 5% szerokości z gradientem */}
      {projects.length > 1 && (
        <button
          type="button"
          onClick={handlePrev}
          className="w-[5%] h-full flex items-center justify-start pl-2 z-10 cursor-pointer transition-all duration-200 bg-gradient-to-r from-transparent via-white/30 to-white/70 dark:from-transparent dark:via-gray-800/30 dark:to-gray-800/70 hover:via-white/60 hover:to-white/90 dark:hover:via-gray-800/60 dark:hover:to-gray-800/90"
          aria-label="Poprzedni projekt"
        >
          <ChevronLeft size={32} className="text-gray-800 dark:text-gray-200 opacity-70 hover:opacity-100 transition-opacity" />
        </button>
      )}

      {/* Główna zawartość - 90% szerokości (lub 100% jeśli brak strzałek) */}
      <div className={`h-full overflow-y-auto ${projects.length > 1 ? 'w-[90%]' : 'w-full'} no-scrollbar`}>
        {projects.length === 0 ? (
          <div className="h-full flex items-center justify-center bg-white dark:bg-gray-800 rounded-lg shadow-md p-12 text-center">
            <div>
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
          </div>
        ) : (
          <>
            {/* Projekt - zajmuje dokładnie (screen - navbar) wysokości */}
            <div className="h-[calc(100vh-4.5rem)] flex-shrink-0 ">
              <div
                key={projects[currentIndex]?.id}
                className={`h-full transition-opacity duration-300 ${
                  isTransitioning ? "opacity-0" : "opacity-100 "
                }`}
              >
                {projects[currentIndex] && (
                  <ProjectView
                    project={projects[currentIndex]}
                    onImageClick={(imageUrl) => setEnlargedImage(imageUrl)}
                    hideNavbar={true}
                  />
                )}
              </div>
            </div>

            {/* Informacje o projekcie na dole - pod projektem (poza ekranem) */}
            <div className="flex-shrink-0 p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 ">
              <div className="flex flex-wrap items-center justify-between gap-4 ">
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
                    onClick={() => navigate("/projects/new")}
                    className="flex items-center space-x-2 px-6 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                  >
                    <Plus size={20} />
                    <span>Dodaj projekt</span>
                  </button>
                  <button
                    onClick={() =>
                      navigate(`/projects/${projects[currentIndex].id}`)
                    }
                    className="rounded-lg border border-gray-300 px-4 py-2 text-gray-700 transition hover:bg-gray-100 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700"
                  >
                    Szczegóły
                  </button>
                  <button
                    onClick={() =>
                      navigate(`/projects/${projects[currentIndex].id}/edit`)
                    }
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
          </>
        )}
      </div>

      {/* Prawa strzałka - 5% szerokości z gradientem */}
      {projects.length > 1 && (
        <button
          type="button"
          onClick={handleNext}
          className="w-[5%] h-full flex items-center justify-end pr-2 z-10 cursor-pointer transition-all duration-200 bg-gradient-to-l from-transparent via-white/30 to-white/70 dark:from-transparent dark:via-gray-800/30 dark:to-gray-800/70 hover:via-white/60 hover:to-white/90 dark:hover:via-gray-800/60 dark:hover:to-gray-800/90"
          aria-label="Następny projekt"
        >
          <ChevronRight size={32} className="text-gray-800 dark:text-gray-200 opacity-70 hover:opacity-100 transition-opacity" />
        </button>
      )}

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

export default ProjectsList;
