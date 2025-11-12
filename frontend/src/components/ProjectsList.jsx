import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../axios";
import { Plus, Image as ImageIcon } from "lucide-react";
import MainPage from "./MainPage";

function ProjectsList() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProjects();
  }, []);

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
      setProjects(projects.filter((project) => project.id !== id));
    } catch (err) {
      console.error("Error deleting project:", err);
      alert("Nie udało się usunąć projektu");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Ładowanie projektów...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={fetchProjects}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Spróbuj ponownie
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <MainPage />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Moje projekty</h1>
          <button
            onClick={() => navigate("/projects/new")}
            className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <Plus size={20} />
            <span>Dodaj projekt</span>
          </button>
        </div>

        {/* Lista projektów */}
        {projects.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <p className="text-gray-600 mb-4">Nie masz jeszcze żadnych projektów.</p>
            <button
              onClick={() => navigate("/projects/new")}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Dodaj pierwszy projekt
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <div
                key={project.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => navigate(`/projects/${project.id}`)}
              >
                {/* Zdjęcie */}
                {project.images && project.images.length > 0 ? (
                  <div className="h-48 overflow-hidden">
                    <img
                      src={project.images[0]}
                      alt={project.data?.title || "Project"}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="h-48 bg-gray-200 flex items-center justify-center">
                    <ImageIcon size={48} className="text-gray-400" />
                  </div>
                )}

                {/* Treść */}
                <div className="p-4">
                  <h2 className="text-xl font-semibold text-gray-800 mb-2">
                    {project.data?.title || "Bez tytułu"}
                  </h2>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {project.data?.description || "Brak opisu"}
                  </p>

                  {/* Technologie */}
                  {project.data?.technologies && project.data.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.data.technologies.slice(0, 3).map((tech, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded"
                        >
                          {tech}
                        </span>
                      ))}
                      {project.data.technologies.length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                          +{project.data.technologies.length - 3}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Akcje */}
                  <div className="flex space-x-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/projects/${project.id}`);
                      }}
                      className="flex-1 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
                    >
                      Zobacz
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(project.id);
                      }}
                      className="px-4 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700"
                    >
                      Usuń
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ProjectsList;

