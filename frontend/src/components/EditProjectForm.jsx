import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../axios";

function EditProjectForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    data: ""
  });
  const [images, setImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProject();
  }, [id]);

  const fetchProject = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/projects/${id}`);
      const project = response.data;
      setFormData({
        data: JSON.stringify(project.data, null, 2)
      });
      setExistingImages(project.images || []);
    } catch (err) {
      console.error("Error fetching project:", err);
      setError("Nie udało się załadować projektu");
    } finally {
      setLoading(false);
    }
  };

  const handleDataChange = (e) => {
    setFormData({ ...formData, data: e.target.value });
  };

  const handleImageChange = (e) => {
    setImages(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      // Walidacja JSON
      let parsedData;
      try {
        parsedData = JSON.parse(formData.data);
      } catch (err) {
        setError("Nieprawidłowy format JSON. Sprawdź składnię.");
        setSaving(false);
        return;
      }

      // Tworzenie FormData dla multipart/form-data
      const submitData = new FormData();
      submitData.append("data", JSON.stringify(parsedData));

      // Dodawanie nowych zdjęć - Rails oczekuje tablicy
      images.forEach((image) => {
        submitData.append("images[]", image);
      });

      await api.patch(`/projects/${id}`, submitData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Przekierowanie do szczegółów projektu
      navigate(`/projects/${id}`);
    } catch (err) {
      console.error("Error updating project:", err);
      setError(
        err.response?.data?.errors?.join(", ") ||
        err.response?.data?.error ||
        "Wystąpił błąd podczas aktualizacji projektu"
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Ładowanie projektu...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">
            Edytuj projekt
          </h1>

          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Pole JSON */}
            <div>
              <label
                htmlFor="data"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Dane projektu (JSON)
              </label>
              <textarea
                id="data"
                value={formData.data}
                onChange={handleDataChange}
                rows={15}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
              />
            </div>

            {/* Istniejące zdjęcia */}
            {existingImages.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Istniejące zdjęcia
                </label>
                <div className="grid grid-cols-3 gap-4 mb-4">
                  {existingImages.map((imageUrl, idx) => (
                    <div key={idx} className="relative">
                      <img
                        src={imageUrl}
                        alt={`Existing ${idx + 1}`}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                    </div>
                  ))}
                </div>
                <p className="text-sm text-gray-500">
                  Nowe zdjęcia zostaną dodane do istniejących.
                </p>
              </div>
            )}

            {/* Pole nowych zdjęć */}
            <div>
              <label
                htmlFor="images"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Dodaj nowe zdjęcia
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
                disabled={saving}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? "Zapisywanie..." : "Zapisz zmiany"}
              </button>
              <button
                type="button"
                onClick={() => navigate(`/projects/${id}`)}
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
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

export default EditProjectForm;

