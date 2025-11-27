import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../axios";
import { ArrowLeft, Edit, Trash2 } from "lucide-react";
import MainPage from "./MainPage";
import ProjectView from "./ProjectView";

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

  const getProjectTitle = () => {
    const sections = project?.data?.sections || [];
    const titleSection = sections.find((section) => section.type === "title");
    return titleSection?.value || "Bez tytułu";
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
          <div className="p-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">{getProjectTitle()}</h1>
                <p className="text-gray-500 text-sm">
                  Utworzono: {new Date(project.created_at).toLocaleDateString("pl-PL")}
                </p>
                <p className="text-gray-500 text-sm">
                  Template: {project.template_key || project.data?.template_key || "Nieznany"}
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

            <ProjectView project={project} />

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


