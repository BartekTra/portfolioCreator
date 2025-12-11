import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../axios";
import { ArrowLeft, Save } from "lucide-react";
import MainPage from "./MainPage";

const TITLE_TEMPLATES = [
  {
    id: "titleTemplate1",
    name: "Template 1",
    description: "Klasyczny układ z dużą fotografią"
  },
  {
    id: "titleTemplate2",
    name: "Template 2",
    description: "Nowoczesny układ z akcentem na tekst"
  },
  {
    id: "titleTemplate3",
    name: "Template 3",
    description: "Minimalistyczny układ z wyróżnionymi danymi kontaktowymi"
  }
];

function TitlePageForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [formData, setFormData] = useState({
    phone: "",
    email: "",
    address: "",
    bio: "",
    experience: [],
    template_key: "titleTemplate1"
  });
  const [photo, setPhoto] = useState(null);
  const [existingPhotoUrl, setExistingPhotoUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(isEditing);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isEditing) {
      fetchTitlePage();
    }
  }, [id]);

  const fetchTitlePage = async () => {
    try {
      setLoadingData(true);
      const response = await api.get(`/title_pages/${id}`);
      const page = response.data;
      setFormData({
        phone: page.phone || "",
        email: page.email || "",
        address: page.address || "",
        bio: page.bio || "",
        experience: page.experience || [],
        template_key: page.template_key || "titleTemplate1"
      });
      setExistingPhotoUrl(page.photo_url);
    } catch (err) {
      console.error("Error fetching title page:", err);
      setError("Nie udało się załadować strony tytułowej");
    } finally {
      setLoadingData(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handlePhotoChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setPhoto(e.target.files[0]);
    }
  };

  const handleExperienceChange = (index, field, value) => {
    const newExperience = [...formData.experience];
    if (!newExperience[index]) {
      newExperience[index] = { company: "", position: "", period: "", description: "" };
    }
    newExperience[index][field] = value;
    setFormData({ ...formData, experience: newExperience });
  };

  const addExperience = () => {
    setFormData({
      ...formData,
      experience: [...formData.experience, { company: "", position: "", period: "", description: "" }]
    });
  };

  const removeExperience = (index) => {
    const newExperience = formData.experience.filter((_, i) => i !== index);
    setFormData({ ...formData, experience: newExperience });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const submitData = new FormData();
      submitData.append("phone", formData.phone);
      submitData.append("email", formData.email);
      submitData.append("address", formData.address);
      submitData.append("bio", formData.bio);
      submitData.append("template_key", formData.template_key);
      submitData.append("experience", JSON.stringify(formData.experience));

      if (photo) {
        submitData.append("photo", photo);
      }

      if (isEditing) {
        await api.patch(`/title_pages/${id}`, submitData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      } else {
        await api.post("/title_pages", submitData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      }

      navigate("/title_pages");
    } catch (err) {
      console.error("Error saving title page:", err);
      setError(
        err.response?.data?.error ||
        err.response?.data?.errors?.join(", ") ||
        "Wystąpił błąd podczas zapisywania strony tytułowej"
      );
    } finally {
      setLoading(false);
    }
  };

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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => navigate("/title_pages")}
          className="mb-6 flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
        >
          <ArrowLeft size={20} />
          <span>Wróć do listy stron tytułowych</span>
        </button>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6">
            {isEditing ? "Edytuj stronę tytułową" : "Nowa strona tytułowa"}
          </h1>

          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 dark:border-red-400 rounded-lg">
              <p className="text-red-700 dark:text-red-400 font-medium">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Wybór template */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Wybierz template *
              </label>
              <div className="grid gap-4 md:grid-cols-3">
                {TITLE_TEMPLATES.map((template) => (
                  <button
                    key={template.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, template_key: template.id })}
                    className={`p-4 border-2 rounded-lg text-left transition-all ${
                      formData.template_key === template.id
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                        : "border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500"
                    }`}
                  >
                    <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-1">
                      {template.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {template.description}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Zdjęcie */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Zdjęcie profilowe
              </label>
              {existingPhotoUrl && !photo && (
                <div className="mb-4">
                  <img
                    src={existingPhotoUrl}
                    alt="Obecne zdjęcie"
                    className="w-32 h-32 rounded-full object-cover mb-2"
                  />
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100"
              />
              {photo && (
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                  Wybrano: {photo.name}
                </p>
              )}
            </div>

            {/* Dane kontaktowe */}
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Numer telefonu
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100"
                  placeholder="+48 123 456 789"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100"
                  placeholder="jan.kowalski@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Adres
              </label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                rows={2}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100"
                placeholder="ul. Przykładowa 123, 00-000 Warszawa"
              />
            </div>

            {/* Opis */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Krótki opis
              </label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100"
                placeholder="Krótki opis o sobie..."
              />
            </div>

            {/* Doświadczenie */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Doświadczenie zawodowe
                </label>
                <button
                  type="button"
                  onClick={addExperience}
                  className="px-3 py-1 text-sm bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600"
                >
                  + Dodaj
                </button>
              </div>
              {formData.experience.map((exp, index) => (
                <div key={index} className="mb-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="grid gap-4 md:grid-cols-2 mb-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                        Firma
                      </label>
                      <input
                        type="text"
                        value={exp.company || ""}
                        onChange={(e) => handleExperienceChange(index, "company", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-600 dark:text-gray-100 text-sm"
                        placeholder="Nazwa firmy"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                        Stanowisko
                      </label>
                      <input
                        type="text"
                        value={exp.position || ""}
                        onChange={(e) => handleExperienceChange(index, "position", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-600 dark:text-gray-100 text-sm"
                        placeholder="Stanowisko"
                      />
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                      Okres
                    </label>
                    <input
                      type="text"
                      value={exp.period || ""}
                      onChange={(e) => handleExperienceChange(index, "period", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-600 dark:text-gray-100 text-sm"
                      placeholder="np. 2020 - obecnie"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                      Opis
                    </label>
                    <textarea
                      value={exp.description || ""}
                      onChange={(e) => handleExperienceChange(index, "description", e.target.value)}
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-600 dark:text-gray-100 text-sm"
                      placeholder="Opis obowiązków..."
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeExperience(index)}
                    className="text-sm text-red-600 dark:text-red-400 hover:underline"
                  >
                    Usuń
                  </button>
                </div>
              ))}
              {formData.experience.length === 0 && (
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                  Brak doświadczenia. Kliknij "Dodaj", aby dodać pozycję.
                </p>
              )}
            </div>

            {/* Przyciski */}
            <div className="flex space-x-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <button
                type="submit"
                disabled={loading || !formData.email.trim()}
                className="flex-1 flex items-center justify-center space-x-2 px-6 py-3 bg-blue-600 dark:bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Save size={20} />
                <span>{loading ? "Zapisywanie..." : "Zapisz stronę tytułową"}</span>
              </button>
              <button
                type="button"
                onClick={() => navigate("/title_pages")}
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

export default TitlePageForm;

