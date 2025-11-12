import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../axios";

function NewProjectForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    technologies: "",
    github_url: "",
    live_url: "",
  });
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    setImages(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Walidacja wymaganych pól
      if (!formData.title.trim()) {
        setError("Tytuł projektu jest wymagany");
        setLoading(false);
        return;
      }

      // Konwersja technologies z string na array
      const technologiesArray = formData.technologies
        .split(",")
        .map((tech) => tech.trim())
        .filter((tech) => tech.length > 0);

      // Przygotowanie danych JSON
      const projectData = {
        title: formData.title,
        description: formData.description,
        technologies: technologiesArray,
        github_url: formData.github_url,
        live_url: formData.live_url,
      };

      // Tworzenie FormData dla multipart/form-data
      const submitData = new FormData();
      submitData.append("data", JSON.stringify(projectData));

      // Dodawanie zdjęć
      images.forEach((image) => {
        submitData.append("images[]", image);
      });

      const response = await api.post("/projects", submitData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Przekierowanie do szczegółów projektu
      navigate(`/projects/${response.data.id}`);
    } catch (err) {
      console.error("Error creating project:", err);
      setError(
        err.response?.data?.errors?.join(", ") ||
        err.response?.data?.error ||
        "Wystąpił błąd podczas tworzenia projektu"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">
            Dodaj nowy projekt
          </h1>

          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Tytuł projektu */}
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Tytuł projektu *
              </label>
              <input
                id="title"
                name="title"
                type="text"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Nazwa projektu"
              />
            </div>

            {/* Opis projektu */}
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Opis projektu
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={5}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Opisz swój projekt..."
              />
            </div>

            {/* Technologie */}
            <div>
              <label
                htmlFor="technologies"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Technologie
              </label>
              <input
                id="technologies"
                name="technologies"
                type="text"
                value={formData.technologies}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="React, Node.js, MongoDB (oddziel przecinkami)"
              />
              <p className="mt-2 text-sm text-gray-500">
                Oddziel technologie przecinkami
              </p>
            </div>

            {/* GitHub URL */}
            <div>
              <label
                htmlFor="github_url"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Link do GitHub
              </label>
              <input
                id="github_url"
                name="github_url"
                type="url"
                value={formData.github_url}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="https://github.com/username/repo"
              />
            </div>

            {/* Live URL */}
            <div>
              <label
                htmlFor="live_url"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Link do wersji live
              </label>
              <input
                id="live_url"
                name="live_url"
                type="url"
                value={formData.live_url}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="https://example.com"
              />
            </div>

            {/* Zdjęcia projektu */}
            <div>
              <label
                htmlFor="images"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Zdjęcia projektu
              </label>
              <input
                id="images"
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              {images.length > 0 && (
                <p className="mt-2 text-sm text-gray-600">
                  Wybrano {images.length} {images.length === 1 ? "zdjęcie" : "zdjęć"}
                </p>
              )}
            </div>

            {/* Przyciski */}
            <div className="flex space-x-4">
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? "Tworzenie..." : "Utwórz projekt"}
              </button>
              <button
                type="button"
                onClick={() => navigate("/projects")}
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
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

export default NewProjectForm;