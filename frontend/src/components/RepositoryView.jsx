import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../axios";
import ProjectTemplateRenderer from "./ProjectTemplateRenderer";
import ProjectView from "./ProjectView";
import MainPage from "./MainPage";
import { ArrowLeft, Edit, Trash2, X, ChevronLeft, ChevronRight } from "lucide-react";

function RepositoryView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [repository, setRepository] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [enlargedImage, setEnlargedImage] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    fetchRepository();
  }, [id]);

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
      setError("Nie udało się załadować portfolio");
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
    if (!window.confirm("Czy na pewno chcesz usunąć to portfolio?")) {
      return;
    }

    try {
      await api.delete(`/repositories/${id}`);
      navigate("/repositories");
    } catch (err) {
      console.error("Error deleting repository:", err);
      alert("Nie udało się usunąć portfolio");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <p className="text-gray-600 dark:text-gray-300">Ładowanie portfolio...</p>
      </div>
    );
  }

  if (error || !repository) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400 mb-4">
            {error || "Portfolio nie zostało znalezione"}
          </p>
          <button
            onClick={() => navigate("/repositories")}
            className="px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600"
          >
            Wróć do listy portfolio
          </button>
        </div>
      </div>
    );
  }

  // Funkcja renderująca stronę tytułową
  const renderTitlePage = (titlePage) => {
    if (!titlePage) return null;

    return (
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
    );
  };

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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <MainPage />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => navigate("/repositories")}
          className="mb-6 flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
        >
          <ArrowLeft size={20} />
          <span>Wróć do listy portfolio</span>
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

            {/* Wyświetlanie elementów portfolio */}
            {totalItems === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 dark:text-gray-400">
                  To portfolio nie zawiera żadnych projektów.
                </p>
              </div>
            ) : (
              <div className="space-y-8">
                <div className="relative">
                  <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
                    <div
                      key={currentItem?.type === "title_page" ? "title_page" : currentItem?.data?.id}
                      className={`transition-opacity duration-300 ${
                        isTransitioning ? "opacity-0" : "opacity-100"
                      }`}
                    >
                      {currentItem?.type === "title_page" ? (
                        <div>
                          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
                            Strona tytułowa
                          </h2>
                          {renderTitlePage(currentItem.data)}
                        </div>
                      ) : currentItem?.type === "project" && currentItem.data ? (
                        <ProjectView 
                          project={currentItem.data} 
                          onImageClick={(imageUrl) => setEnlargedImage(imageUrl)}
                          hideNavbar={true}
                        />
                      ) : null}
                    </div>
                  </div>

                  {totalItems > 1 && (
                    <>
                      <button
                        type="button"
                        onClick={handlePrev}
                        className="fixed left-4 top-1/2 -translate-y-1/2 z-10 rounded-full bg-white/70 p-2 text-gray-800 shadow-lg transition hover:bg-white dark:bg-gray-900/80 dark:text-gray-100"
                        aria-label="Poprzedni element"
                      >
                        <ChevronLeft size={24} />
                      </button>
                      <button
                        type="button"
                        onClick={handleNext}
                        className="fixed right-4 top-1/2 -translate-y-1/2 z-10 rounded-full bg-white/70 p-2 text-gray-800 shadow-lg transition hover:bg-white dark:bg-gray-900/80 dark:text-gray-100"
                        aria-label="Następny element"
                      >
                        <ChevronRight size={24} />
                      </button>
                    </>
                  )}
                </div>

                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <p className="text-sm uppercase tracking-wide text-gray-500 dark:text-gray-400">
                      {currentItem?.type === "title_page" 
                        ? "Strona tytułowa" 
                        : `Projekt ${hasTitlePage ? currentIndex : currentIndex + 1}`} / {totalItems}
                    </p>
                    {currentItem?.type === "project" && currentItem.data && (
                      <>
                        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
                          {(() => {
                            const sections = currentItem.data.data?.sections || [];
                            const titleSection = sections.find((section) => section.type === "title");
                            return titleSection?.value || "Bez tytułu";
                          })()}
                        </h2>
                        <p className="text-gray-500 dark:text-gray-400">
                          Template: {currentItem.data?.template_key || "Nieznany"}
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
                        Szczegóły
                      </button>
                    </div>
                  )}
                </div>
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

