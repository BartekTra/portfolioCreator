import React, { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useParams, useNavigate } from "react-router-dom";
import api from "../axios";
import ProjectTemplateRenderer from "./ProjectTemplateRenderer";
import ProjectView from "./ProjectView";
import TitlePageTemplateRenderer from "./TitlePageTemplateRenderer";
import { ArrowLeft, Edit, Trash2, X, ChevronLeft, ChevronRight, Share2, Copy, Check } from "lucide-react";

function RepositoryView() {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const [repository, setRepository] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [enlargedImage, setEnlargedImage] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [shareUrl, setShareUrl] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchRepository();
  }, [id]);

  // Sprawdź czy portfolio ma już token udostępniania
  useEffect(() => {
    if (repository?.public_share_token) {
      const url = `${window.location.origin}/share/${repository.public_share_token}`;
      setShareUrl(url);
    }
  }, [repository]);

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

  const handleDelete = async () => {
    if (!window.confirm(t("repositories.list.deleteConfirm"))) {
      return;
    }

    try {
      await api.delete(`/repositories/${id}`);
      navigate("/repositories");
    } catch (err) {
      console.error("Error deleting repository:", err);
      alert(t("errors.deleteFailed"));
    }
  };

  const handleGenerateShareToken = async () => {
    try {
      const response = await api.post(`/repositories/${id}/generate_share_token`);
      const url = response.data.share_url;
      setShareUrl(url);
      
      // Skopiuj do schowka
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Error generating share token:", err);
      alert(t("errors.generic"));
    }
  };

  const handleCopyShareUrl = async () => {
    if (shareUrl) {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <p className="text-gray-600 dark:text-gray-300">{t("repositories.view.loading")}</p>
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
          <button
            onClick={() => navigate("/repositories")}
            className="px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600"
          >
            {t("common.back")}
          </button>
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
    <div className="w-full h-full flex flex-row">
      {/* Lewa strzałka - 5% szerokości z gradientem */}
      {totalItems > 1 && (
        <button
          type="button"
          onClick={handlePrev}
          className="w-[5%] h-full flex items-center justify-start pl-2 z-10 cursor-pointer transition-all duration-200 bg-gradient-to-r from-transparent via-white/30 to-white/70 dark:from-transparent dark:via-gray-800/30 dark:to-gray-800/70 hover:via-white/60 hover:to-white/90 dark:hover:via-gray-800/60 dark:hover:to-gray-800/90"
          aria-label="Poprzedni element"
        >
          <ChevronLeft size={32} className="text-gray-800 dark:text-gray-200 opacity-70 hover:opacity-100 transition-opacity" />
        </button>
      )}

      {/* Główna zawartość - 90% szerokości (lub 100% jeśli brak strzałek) */}
      <div className={`h-full flex flex-col min-h-0 ${totalItems > 1 ? 'w-[90%]' : 'w-full'}`}>
        {/* Header z informacjami o repozytorium */}
        <div className="flex-shrink-0 p-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <button
                  onClick={() => navigate("/repositories")}
                  className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                >
                  <ArrowLeft size={20} />
                  <span>{t("common.back")}</span>
                </button>
              </div>
              <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">
                {repository.name}
              </h1>
              {repository.description && (
                <p className="text-gray-600 dark:text-gray-300 mb-2">
                  {repository.description}
                </p>
              )}
              <div className="flex gap-4 text-sm text-gray-500 dark:text-gray-400">
                <p>{t("projects.view.createdAt")}: {new Date(repository.created_at).toLocaleDateString()}</p>
                <p>{t("repositories.view.projects")}: {repository.project_count}</p>
              </div>
            </div>
            <div className="flex space-x-2">
              {shareUrl ? (
                <div className="flex items-center space-x-2 bg-green-100 dark:bg-green-900 px-4 py-2 rounded-lg">
                  <input
                    type="text"
                    value={shareUrl}
                    readOnly
                    className="bg-transparent border-none text-sm text-gray-700 dark:text-gray-200 min-w-[300px]"
                  />
                  <button
                    onClick={handleCopyShareUrl}
                    className="p-1 text-green-700 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-800 rounded"
                    title={copied ? t("repositories.view.urlCopied") : t("repositories.view.copyUrl")}
                  >
                    {copied ? <Check size={16} /> : <Copy size={16} />}
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleGenerateShareToken}
                  className="p-2 bg-green-600 dark:bg-green-500 text-white rounded-lg hover:bg-green-700 dark:hover:bg-green-600"
                  title={t("repositories.list.share")}
                >
                  <Share2 size={20} />
                </button>
              )}
              <button
                onClick={() => navigate(`/repositories/${id}/edit`)}
                className="p-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600"
                title={t("common.edit")}
              >
                <Edit size={20} />
              </button>
              <button
                onClick={handleDelete}
                className="p-2 bg-red-600 dark:bg-red-500 text-white rounded-lg hover:bg-red-700 dark:hover:bg-red-600"
                title={t("common.delete")}
              >
                <Trash2 size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Wyświetlanie elementów portfolio - scrollowalny kontener z projektem i footerem */}
        {totalItems === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-gray-500 dark:text-gray-400">
              {t("repositories.view.emptyPortfolio")}
            </p>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto">
            {/* Projekt/Strona tytułowa - zajmuje maksymalnie dużo miejsca (prawie cały ekran) */}
            <div
              key={currentItem?.type === "title_page" ? "title_page" : currentItem?.data?.id}
              className={`min-h-[calc(100vh-180px)] transition-opacity duration-300 ${
                isTransitioning ? "opacity-0" : "opacity-100"
              }`}
            >
              {currentItem?.type === "title_page" ? (
                <div className="p-6">
                  <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
                    {t("repositories.view.titlePage")}
                  </h2>
                  <TitlePageTemplateRenderer titlePage={currentItem.data} />
                </div>
              ) : currentItem?.type === "project" && currentItem.data ? (
                <ProjectView 
                  project={currentItem.data} 
                  onImageClick={(imageUrl) => setEnlargedImage(imageUrl)}
                  hideNavbar={true}
                />
              ) : null}
            </div>

            {/* Footer z informacjami o aktualnym elemencie - pod projektem, poza ekranem */}
            <div className="p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-wide text-gray-500 dark:text-gray-400">
                    {currentItem?.type === "title_page" 
                      ? t("repositories.view.titlePage")
                      : `${t("repositories.view.project")} ${hasTitlePage ? currentIndex : currentIndex + 1}`} {t("repositories.view.of")} {totalItems}
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
                          const titleSection = sections.find((section) => section.type === "title");
                          return titleSection?.value || "Bez tytułu";
                        })()}
                      </h2>
                      <p className="text-gray-500 dark:text-gray-400">
                        {t("projects.view.template")}: {currentItem.data?.template_key || t("common.unknown")}
                      </p>
                    </>
                  )}
                </div>
                {currentItem?.type === "project" && currentItem.data && (
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => navigate(`/projects/${currentItem.data.id}`)}
                      className="rounded-lg border border-gray-300 px-4 py-2 text-gray-700 transition hover:bg-gray-100 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700"
                    >
                      {t("common.details")}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Prawa strzałka - 5% szerokości z gradientem */}
      {totalItems > 1 && (
        <button
          type="button"
          onClick={handleNext}
          className="w-[5%] h-full flex items-center justify-end pr-2 z-10 cursor-pointer transition-all duration-200 bg-gradient-to-l from-transparent via-white/30 to-white/70 dark:from-transparent dark:via-gray-800/30 dark:to-gray-800/70 hover:via-white/60 hover:to-white/90 dark:hover:via-gray-800/60 dark:hover:to-gray-800/90"
          aria-label="Następny element"
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
            alt={t("common.enlargedImage")}
            className="max-w-[90vw] max-h-[90vh] object-contain rounded-lg shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}

export default RepositoryView;

