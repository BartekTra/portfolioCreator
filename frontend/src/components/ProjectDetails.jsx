import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../axios";
import { ArrowLeft, Edit, Trash2, ExternalLink, Github } from "lucide-react";
import MainPage from "./MainPage";

function ProjectDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProject();
  }, [id]);

  const fetchProject = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/projects/${id}`);
      setProject(response.data);
    } catch (err) {
      console.error("Error fetching project:", err);
      setError("Nie udało się załadować projektu");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Czy na pewno chcesz usunąć ten projekt?")) {
      return;
    }

    try {
      await api.delete(`/projects/${id}`);
      navigate("/projects");
    } catch (err) {
      console.error("Error deleting project:", err);
      alert("Nie udało się usunąć projektu");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Ładowanie projektu...</p>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || "Projekt nie został znaleziony"}</p>
          <button
            onClick={() => navigate("/projects")}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Wróć do listy projektów
          </button>
        </div>
      </div>
    );
  }

  return (
    
    <div className="min-h-screen bg-gray-50">
      <MainPage />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Przycisk powrotu */}
        <button
          onClick={() => navigate("/projects")}
          className="mb-6 flex items-center space-x-2 text-gray-600 hover:text-gray-800"
        >
          <ArrowLeft size={20} />
          <span>Wróć do listy projektów</span>
        </button>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Zdjęcia */}
          {project.images && project.images.length > 0 && (
            <div className="mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {project.images.map((imageUrl, idx) => (
                  <div key={idx} className="overflow-hidden rounded-lg">
                    <img
                      src={imageUrl}
                      alt={`${project.data?.title || "Project"} - ${idx + 1}`}
                      className="w-full h-64 object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Treść */}
          <div className="p-6">
            {/* Header */}
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">
                  {project.data?.title || "Bez tytułu"}
                </h1>
                <p className="text-gray-500 text-sm">
                  Utworzono: {new Date(project.created_at).toLocaleDateString("pl-PL")}
                </p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => navigate(`/projects/${id}/edit`)}
                  className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  title="Edytuj"
                >
                  <Edit size={20} />
                </button>
                <button
                  onClick={handleDelete}
                  className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  title="Usuń"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>

            {/* Opis */}
            {project.data?.description && (
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-2">Opis</h2>
                <p className="text-gray-600 whitespace-pre-wrap">
                  {project.data.description}
                </p>
              </div>
            )}

            {/* Technologie */}
            {project.data?.technologies && project.data.technologies.length > 0 && (
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-2">Technologie</h2>
                <div className="flex flex-wrap gap-2">
                  {project.data.technologies.map((tech, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Linki */}
            {(project.data?.github_url || project.data?.live_url) && (
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-2">Linki</h2>
                <div className="flex flex-wrap gap-4">
                  {project.data.github_url && (
                    <a
                      href={project.data.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-2 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900"
                    >
                      <Github size={20} />
                      <span>GitHub</span>
                    </a>
                  )}
                  {project.data.live_url && (
                    <a
                      href={project.data.live_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      <ExternalLink size={20} />
                      <span>Zobacz na żywo</span>
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* Surowe dane JSON (opcjonalnie) */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <details className="cursor-pointer">
                <summary className="text-sm font-medium text-gray-600 hover:text-gray-800">
                  Zobacz surowe dane JSON
                </summary>
                <pre className="mt-4 p-4 bg-gray-100 rounded-lg overflow-x-auto text-xs">
                  {JSON.stringify(project.data, null, 2)}
                </pre>
              </details>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProjectDetails;

