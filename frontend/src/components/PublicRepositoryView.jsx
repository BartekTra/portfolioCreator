import React, { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import axios from "axios";
import ProjectView from "./ProjectView";
import TitlePageTemplateRenderer from "./TitlePageTemplateRenderer";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

// Osobna instancja axios dla publicznych endpointów (bez tokenów)
const publicApi = axios.create({
  baseURL: "http://localhost:3000/api/v1",
  withCredentials: true,
});

function PublicRepositoryView() {
  const { t } = useTranslation();
  const { token } = useParams();
  const [repository, setRepository] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [enlargedImage, setEnlargedImage] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    fetchRepository();
  }, [token]);

  const totalItems = (repository?.title_page ? 1 : 0) + projects.length;

  useEffect(() => {
    if (totalItems === 0) {
      setCurrentIndex(0);
      return;
    }
    setCurrentIndex((prev) => Math.min(prev, totalItems - 1));
  }, [totalItems]);

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
      const response = await publicApi.get(`/public/repositories/${token}`);
      setRepository(response.data);

      // Pobierz pełne dane projektów używając publicznego API
      const projectPromises = response.data.project_ids.map((projectId) =>
        publicApi.get(`/public/projects/${projectId}`)
      );
      const projectResponses = await Promise.all(projectPromises);
      setProjects(projectResponses.map((res) => res.data));
    } catch (err) {
      console.error("Error fetching repository:", err);
      setError(t("repositories.view.loading"));
    } finally {
      setLoading(false);
    }
  };

  // Funkcje nawigacji
  const handleNext = useCallback(() => {
    if (totalItems === 0 || isTransitioning) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % totalItems);
      setTimeout(() => setIsTransitioning(false), 50);
    }, 250);
  }, [totalItems, isTransitioning]);

  const handlePrev = useCallback(() => {
    if (totalItems === 0 || isTransitioning) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + totalItems) % totalItems);
      setTimeout(() => setIsTransitioning(false), 50);
    }, 250);
  }, [totalItems, isTransitioning]);

  // Obsługa klawiatury - strzałki lewo/prawo
  useEffect(() => {
    if (totalItems <= 1) return;

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
  }, [totalItems, handlePrev, handleNext]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <p className="text-gray-600 dark:text-gray-300">
{t("repositories.view.loading")}
        </p>
      </div>
    );
  }

  if (error || !repository) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400 mb-4">
            {error || t("repositories.view.notFound")}
          </p>
        </div>
      </div>
    );
  }

  // Funkcja zwracająca aktualnie wyświetlany element
  const getCurrentItem = () => {
    const hasTitlePage = repository?.title_page;

    if (totalItems === 0) return null;

    // Jeśli jest strona tytułowa i currentIndex = 0, zwróć stronę tytułową
    if (hasTitlePage && currentIndex === 0) {
      return { type: "title_page", data: repository.title_page };
    }

    // W przeciwnym razie zwróć projekt
    const projectIndex = hasTitlePage ? currentIndex - 1 : currentIndex;
    return { type: "project", data: projects[projectIndex] };
  };

  const currentItem = getCurrentItem();
  const hasTitlePage = repository?.title_page;

  return (
    <div className="w-full h-screen flex flex-row overflow-hidden bg-gray-50 dark:bg-gray-900">
      {/* Lewa strzałka - 5% szerokości z gradientem */}
      {totalItems > 1 && (
        <button
          type="button"
          onClick={handlePrev}
          className="w-[5%] h-screen flex items-center justify-start pl-2 z-10 cursor-pointer transition-all duration-200 bg-gradient-to-r from-transparent via-white/30 to-white/70 dark:from-transparent dark:via-gray-800/30 dark:to-gray-800/70 hover:via-white/60 hover:to-white/90 dark:hover:via-gray-800/60 dark:hover:to-gray-800/90"
          aria-label={t("common.previous")}
        >
          <ChevronLeft size={32} className="text-gray-800 dark:text-gray-200 opacity-70 hover:opacity-100 transition-opacity" />
        </button>
      )}

      {/* Główna zawartość - 90% szerokości (lub 100% jeśli brak strzałek) */}
      <div className={`h-screen flex flex-col ${totalItems > 1 ? 'w-[90%]' : 'w-full'} overflow-hidden`}>
        {/* Wyświetlanie elementów portfolio */}
        {totalItems === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-gray-500 dark:text-gray-400">
              {t("repositories.view.emptyPortfolio")}
            </p>
          </div>
        ) : (
          <>
            {/* Projekt/CV - różne zachowanie: CV scrollowalne, projekt pełnoekranowy */}
            {currentItem?.type === "title_page" ? (
              <div className="flex-1 flex flex-col min-h-0">
                <div
                  key="title_page"
                  className={`flex-1 overflow-y-auto transition-opacity duration-300 ${
                    isTransitioning ? "opacity-0" : "opacity-100"
                  }`}
                >
                  <div className="p-6">
                    <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
                      {t("repositories.view.titlePage")}
                    </h2>
                    <TitlePageTemplateRenderer
                      titlePage={currentItem.data}
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-screen flex-shrink-0">
                <div
                  key={currentItem?.data?.id}
                  className={`h-full transition-opacity duration-300 ${
                    isTransitioning ? "opacity-0" : "opacity-100"
                  }`}
                >
                  {currentItem?.type === "project" && currentItem.data && (
                    <ProjectView
                      project={currentItem.data}
                      onImageClick={(imageUrl) => setEnlargedImage(imageUrl)}
                      hideNavbar={true}
                    />
                  )}
                </div>
              </div>
            )}

            {/* Footer z informacjami o aktualnym elemencie - pod projektem */}
            <div className="flex-shrink-0 p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-wide text-gray-500 dark:text-gray-400">
                    {currentItem?.type === "title_page"
                      ? t("repositories.view.titlePage")
                      : `${t("repositories.view.project")} ${
                          hasTitlePage ? currentIndex : currentIndex + 1
                        }`} {t("repositories.view.of")} {totalItems}
                  </p>
                  {currentItem?.type === "project" && currentItem.data && (
                    <>
                      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
                        {(() => {
                          // Najpierw sprawdź czy jest tytuł w data.title (nowy sposób)
                          if (currentItem.data?.data?.title) {
                            return currentItem.data.data.title;
                          }
                          // Fallback do starego sposobu (sekcja title) dla kompatybilności
                          const sections = currentItem.data.data?.sections || [];
                          const titleSection = sections.find(
                            (section) => section.type === "title"
                          );
                          return titleSection?.value || t("projects.list.noTitle");
                        })()}
                      </h2>
                      <p className="text-gray-500 dark:text-gray-400">
                        {t("projects.view.template")}: {currentItem.data?.template_key || t("common.unknown")}
                      </p>
                    </>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Prawa strzałka - 5% szerokości z gradientem */}
      {totalItems > 1 && (
        <button
          type="button"
          onClick={handleNext}
          className="w-[5%] h-screen flex items-center justify-end pr-2 z-10 cursor-pointer transition-all duration-200 bg-gradient-to-l from-transparent via-white/30 to-white/70 dark:from-transparent dark:via-gray-800/30 dark:to-gray-800/70 hover:via-white/60 hover:to-white/90 dark:hover:via-gray-800/60 dark:hover:to-gray-800/90"
          aria-label={t("common.next")}
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
            aria-label={t("common.close")}
          >
            <X size={24} />
          </button>
          <img
            src={enlargedImage}
            alt={t("common.enlargedImage")}
            className="max-w-[90vw] max-h-[90vh] object-contain rounded-lg shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}

export default PublicRepositoryView;

