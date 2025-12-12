import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../axios";
import ProjectTemplateRenderer from "./ProjectTemplateRenderer";
import { ArrowLeft, Edit, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

function ProjectView({ project: projectProp, onImageClick, hideNavbar = false }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(projectProp || null);
  const [loading, setLoading] = useState(!projectProp);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (id && !projectProp) {
      fetchProject();
    }
  }, [id, projectProp]);

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
      navigate("/");
    } catch (err) {
      console.error("Error deleting project:", err);
      alert("Nie udało się usunąć projektu");
    }
  };

  const getProjectTitle = () => {
    const sections = project?.data?.sections || [];
    const titleSection = sections.find((section) => section.type === "title");
    return titleSection?.value || "Bez tytułu";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <p className="text-gray-600 dark:text-gray-300">Ładowanie projektu...</p>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400 mb-4">{error || "Projekt nie został znaleziony"}</p>
          <button
            onClick={() => navigate("/")}
            className="px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600"
          >
            Wróć do listy projektów
          </button>
        </div>
      </div>
    );
  }

  if (!project?.data) {
    return null;
  }

  if (id && !hideNavbar) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <button
            onClick={() => navigate("/")}
            className="mb-6 flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
          >
            <ArrowLeft size={20} />
            <span>Wróć do listy projektów</span>
          </button>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">
                    {getProjectTitle()}
                  </h1>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    Utworzono: {new Date(project.created_at).toLocaleDateString("pl-PL")}
                  </p>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    Template: {project.template_key || project.data?.template_key || "Nieznany"}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => navigate(`/projects/${id}/edit`)}
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

              <div className="space-y-6">
                <ProjectTemplateRenderer project={project} onImageClick={onImageClick} />
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <details className="cursor-pointer">
                  <summary className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200">
                    Zobacz surowe dane JSON
                  </summary>
                  <pre className="mt-4 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-x-auto text-xs dark:text-gray-300">
                    {JSON.stringify(project.data, null, 2)}
                  </pre>
                </details>
              </div>
            </div>
          </div>
        </div>
    );
  }

  return (
    <div className="space-y-6">
      <ProjectTemplateRenderer project={project} onImageClick={onImageClick} />
    </div>
  );
}

export default ProjectView;