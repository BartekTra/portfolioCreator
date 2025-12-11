import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../axios";
import { ArrowLeft, Save, GripVertical, X } from "lucide-react";
import MainPage from "./MainPage";

function RepositoryForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [availableProjects, setAvailableProjects] = useState([]);
  const [selectedProjects, setSelectedProjects] = useState([]);
  const [availableTitlePages, setAvailableTitlePages] = useState([]);
  const [selectedTitlePageId, setSelectedTitlePageId] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(isEditing);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      await fetchAvailableProjects();
      await fetchAvailableTitlePages();
      if (isEditing) {
        await fetchRepository();
      }
    };
    loadData();
  }, [id]);

  const fetchAvailableProjects = async () => {
    try {
      const response = await api.get("/projects");
      setAvailableProjects(response.data);
    } catch (err) {
      console.error("Error fetching projects:", err);
      setError("Nie udało się załadować projektów");
    }
  };

  const fetchAvailableTitlePages = async () => {
    try {
      const response = await api.get("/title_pages");
      setAvailableTitlePages(response.data);
    } catch (err) {
      console.error("Error fetching title pages:", err);
      setError("Nie udało się załadować stron tytułowych");
    }
  };

  const fetchRepository = async () => {
    try {
      setLoadingData(true);
      const response = await api.get(`/repositories/${id}`);
      const repo = response.data;
      setName(repo.name);
      setDescription(repo.description || "");
      setSelectedTitlePageId(repo.title_page_id?.toString() || "");
      
      // Pobierz pełne dane projektów w odpowiedniej kolejności
      const projectPromises = repo.project_ids.map((projectId) =>
        api.get(`/projects/${projectId}`)
      );
      const projectResponses = await Promise.all(projectPromises);
      const projectsInOrder = projectResponses.map((res) => res.data);
      setSelectedProjects(projectsInOrder);
    } catch (err) {
      console.error("Error fetching repository:", err);
      setError("Nie udało się załadować repozytorium");
    } finally {
      setLoadingData(false);
    }
  };

  const handleAddProject = (project) => {
    if (!selectedProjects.find((p) => p.id === project.id)) {
      setSelectedProjects([...selectedProjects, project]);
    }
  };

  const handleRemoveProject = (projectId) => {
    setSelectedProjects(selectedProjects.filter((p) => p.id !== projectId));
  };

  const moveProject = (fromIndex, toIndex) => {
    const newProjects = [...selectedProjects];
    const [removed] = newProjects.splice(fromIndex, 1);
    newProjects.splice(toIndex, 0, removed);
    setSelectedProjects(newProjects);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (!selectedTitlePageId) {
        setError("Musisz wybrać stronę tytułową");
        setLoading(false);
        return;
      }

      const projectIds = selectedProjects.map((p) => p.id);
      const data = {
        repository: {
          name,
          description,
          title_page_id: selectedTitlePageId,
        },
        project_ids: projectIds,
      };

      if (isEditing) {
        await api.put(`/repositories/${id}`, data);
      } else {
        await api.post("/repositories", data);
      }

      navigate("/repositories");
    } catch (err) {
      console.error("Error saving repository:", err);
      setError(
        err.response?.data?.error ||
        err.response?.data?.errors?.join(", ") ||
        "Wystąpił błąd podczas zapisywania portfolio"
      );
    } finally {
      setLoading(false);
    }
  };

  const getProjectTitle = (project) => {
    const sections = project.data?.sections || [];
    const titleSection = sections.find((section) => section.type === "title");
    return titleSection?.value || "Bez tytułu";
  };

  const unselectedProjects = availableProjects.filter(
    (project) => !selectedProjects.find((p) => p.id === project.id)
  );

  if (loadingData) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <p className="text-gray-600 dark:text-gray-300">Ładowanie...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <MainPage />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => navigate("/repositories")}
          className="mb-6 flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
        >
          <ArrowLeft size={20} />
          <span>Wróć do listy portfolio</span>
        </button>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6">
            {isEditing ? "Edytuj portfolio" : "Nowe portfolio"}
          </h1>

          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 dark:border-red-400 rounded-lg">
              <p className="text-red-700 dark:text-red-400 font-medium">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Nazwa i opis */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Nazwa portfolio *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100"
                  placeholder="Np. Portfolio 2024"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Opis (opcjonalny)
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100"
                  placeholder="Krótki opis portfolio..."
                />
              </div>
            </div>

            {/* Wybór strony tytułowej */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Strona tytułowa * <span className="text-red-500">(wymagane)</span>
              </label>
              {availableTitlePages.length === 0 ? (
                <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-200 dark:border-yellow-800 rounded-lg">
                  <p className="text-yellow-800 dark:text-yellow-200 mb-2">
                    Nie masz jeszcze żadnych stron tytułowych.
                  </p>
                  <button
                    type="button"
                    onClick={() => navigate("/title_pages/new")}
                    className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    Stwórz stronę tytułową →
                  </button>
                </div>
              ) : (
                <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                  {availableTitlePages.map((titlePage) => (
                    <button
                      key={titlePage.id}
                      type="button"
                      onClick={() => setSelectedTitlePageId(titlePage.id.toString())}
                      className={`p-4 text-left border-2 rounded-lg transition-all ${
                        selectedTitlePageId === titlePage.id.toString()
                          ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                          : "border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500"
                      }`}
                    >
                      {titlePage.photo_url && (
                        <img
                          src={titlePage.photo_url}
                          alt="Zdjęcie profilowe"
                          className="w-16 h-16 rounded-full object-cover mb-2 mx-auto"
                        />
                      )}
                      <p className="font-medium text-gray-800 dark:text-gray-200 text-sm">
                        {titlePage.email || "Strona tytułowa"}
                      </p>
                      {titlePage.phone && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          📞 {titlePage.phone}
                        </p>
                      )}
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Template: {titlePage.template_key}
                      </p>
                    </button>
                  ))}
                </div>
              )}
              {availableTitlePages.length > 0 && !selectedTitlePageId && (
                <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                  Musisz wybrać stronę tytułową
                </p>
              )}
            </div>

            {/* Wybrane projekty */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Wybrane projekty ({selectedProjects.length})
              </label>
              {selectedProjects.length === 0 ? (
                <div className="p-8 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-center">
                  <p className="text-gray-500 dark:text-gray-400">
                    Nie wybrano żadnych projektów. Dodaj projekty z listy poniżej.
                  </p>
                </div>
              ) : (
                <div className="space-y-2 mb-4">
                  {selectedProjects.map((project, index) => (
                    <div
                      key={project.id}
                      className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600"
                    >
                      <GripVertical
                        size={20}
                        className="text-gray-400 dark:text-gray-500 cursor-move"
                      />
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400 w-8">
                        {index + 1}.
                      </span>
                      <div className="flex-1">
                        <p className="font-medium text-gray-800 dark:text-gray-200">
                          {getProjectTitle(project)}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Template: {project.template_key}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {index > 0 && (
                          <button
                            type="button"
                            onClick={() => moveProject(index, index - 1)}
                            className="px-2 py-1 text-sm text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded"
                          >
                            ↑
                          </button>
                        )}
                        {index < selectedProjects.length - 1 && (
                          <button
                            type="button"
                            onClick={() => moveProject(index, index + 1)}
                            className="px-2 py-1 text-sm text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded"
                          >
                            ↓
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => handleRemoveProject(project.id)}
                          className="p-1 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                        >
                          <X size={18} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Dostępne projekty */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Dostępne projekty
              </label>
              {unselectedProjects.length === 0 ? (
                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg text-center text-sm text-gray-500 dark:text-gray-400">
                  Wszystkie projekty zostały dodane
                </div>
              ) : (
                <div className="grid gap-3 md:grid-cols-2">
                  {unselectedProjects.map((project) => (
                    <button
                      key={project.id}
                      type="button"
                      onClick={() => handleAddProject(project)}
                      className="p-4 text-left bg-white dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-lg hover:border-blue-500 dark:hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all"
                    >
                      <p className="font-medium text-gray-800 dark:text-gray-200">
                        {getProjectTitle(project)}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Template: {project.template_key}
                      </p>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Przyciski */}
            <div className="flex space-x-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <button
                type="submit"
                disabled={loading || !name.trim() || !selectedTitlePageId}
                className="flex-1 flex items-center justify-center space-x-2 px-6 py-3 bg-blue-600 dark:bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Save size={20} />
                <span>{loading ? "Zapisywanie..." : "Zapisz portfolio"}</span>
              </button>
              <button
                type="button"
                onClick={() => navigate("/repositories")}
                className="px-6 py-3 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 font-semibold rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-colors"
              >
                Anuluj
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default RepositoryForm;

