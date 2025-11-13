import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../axios";
import { Plus, Image as ImageIcon } from "lucide-react";
import MainPage from "./MainPage";
import ProjectView from "./ProjectView";

function ProjectsList() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(()=>{
    console.log(projects);
  },[projects])

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
            <p className="text-gray-600 mb-4">
              Nie masz jeszcze żadnych projektów.
            </p>
            <button
              onClick={() => navigate("/projects/new")}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Dodaj pierwszy projekt
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {projects.map((project) => (
              <ProjectView key={project.id} project={project} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ProjectsList;
