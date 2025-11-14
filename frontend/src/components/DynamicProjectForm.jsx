import React, { useState } from "react";
import { Plus, Trash2, GripVertical } from "lucide-react";
import api from "../axios";

const SECTION_TYPES = {
  title: { label: "Tytuł", multiple: false },
  description: { label: "Opis", multiple: true },
  technologies: { label: "Technologie", multiple: false },
  image: { label: "Zdjęcie", multiple: true },
  github_url: { label: "Link GitHub", multiple: false },
  live_url: { label: "Link Live", multiple: false },
};

function DynamicProjectForm() {
  const [sections, setSections] = useState([
    { id: Date.now(), type: "title", value: "", order: 0 },
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const addSection = (type) => {
    const newSection = {
      id: Date.now(),
      type,
      value: type === "image" ? [] : type === "technologies" ? "" : "",
      order: sections.length,
    };
    setSections([...sections, newSection]);
  };

  const removeSection = (id) => {
    setSections(sections.filter((s) => s.id !== id));
  };

  const updateSection = (id, value) => {
    setSections(sections.map((s) => (s.id === id ? { ...s, value } : s)));
  };

  const handleImageChange = (id, files) => {
    updateSection(id, Array.from(files));
  };

  const validate = () => {
    const titleSection = sections.find((s) => s.type === "title");
    if (!titleSection || !titleSection.value.trim()) {
      setError("Tytuł projektu jest wymagany");
      return false;
    }
    return true;
  };

  const prepareSubmitData = () => {
    const projectData = {
      sections: sections.map((section, index) => {
        if (section.type === "image") {
          return {
            id: section.id,
            type: section.type,
            order: index,
            image_ids: section.value.map((_, idx) => `${section.id}_${idx}`),
          };
        } else if (section.type === "technologies") {
          return {
            id: section.id,
            type: section.type,
            order: index,
            value: section.value
              .split(",")
              .map((tech) => tech.trim())
              .filter((tech) => tech.length > 0),
          };
        } else {
          return {
            id: section.id,
            type: section.type,
            order: index,
            value: section.value,
          };
        }
      }),
    };

    return projectData;
  };

  const handleSubmit = async () => {
    setError(null);
    setSuccess(false);

    if (!validate()) {
      return;
    }

    setLoading(true);

    try {
      const projectData = prepareSubmitData();
      const formData = new FormData();
      
      // Dodaj dane JSON
      formData.append("data", JSON.stringify(projectData));
      
      // POPRAWKA: Dodaj zdjęcia w formacie zagnieżdżonym
      // Rails oczekuje: images[KEY] = file
      sections.forEach((section) => {
        if (section.type === "image" && section.value.length > 0) {
          section.value.forEach((file, idx) => {
            const key = `${section.id}_${idx}`;
            // Użyj formatu images[key] zamiast images[][key]
            formData.append(`images[${key}]`, file);
          });
        }
      });

      // Debug: Zobacz co wysyłamy
      console.log("Wysyłane dane:");
      console.log("JSON data:", projectData);
      console.log("FormData entries:");
      for (let [key, value] of formData.entries()) {
        console.log(`  ${key}:`, value instanceof File ? `File(${value.name})` : value);
      }

      const response = await api.post("/projects", formData, {
        headers: {
          // NIE ustawiaj Content-Type - przeglądarka zrobi to automatycznie z boundary
        },
      });
      
      console.log("Odpowiedź z serwera:", response.data);
      setSuccess(true);
      
      // Opcjonalnie: przekieruj po sukcesie
      // setTimeout(() => navigate(`/projects/${response.data.id}`), 2000);
    } catch (err) {
      console.error("Błąd podczas tworzenia projektu:", err);
      setError(
        err.response?.data?.error || 
        err.response?.data?.errors?.join(", ") ||
        "Wystąpił błąd podczas tworzenia projektu"
      );
    } finally {
      setLoading(false);
    }
  };

  const getAvailableTypes = () => {
    const existingTypes = sections.map((s) => s.type);
    return Object.entries(SECTION_TYPES).filter(([type, config]) => {
      if (config.multiple) return true;
      return !existingTypes.includes(type);
    });
  };

  const renderSection = (section, index) => {
    const config = SECTION_TYPES[section.type];

    return (
      <div
        key={section.id}
        className="bg-white dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-lg p-4 hover:border-blue-300 dark:hover:border-blue-500 transition-colors"
      >
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-2">
            <GripVertical size={20} className="text-gray-400 dark:text-gray-500 cursor-move" />
            <span className="text-lg">{config.icon}</span>
            <h3 className="font-semibold text-gray-700 dark:text-gray-200">
              {config.label}
              {section.type === "title" && (
                <span className="text-red-500 dark:text-red-400 ml-1">*</span>
              )}
            </h3>
          </div>
          {section.type !== "title" && (
            <button
              onClick={() => removeSection(section.id)}
              className="p-1 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
            >
              <Trash2 size={18} />
            </button>
          )}
        </div>

        {section.type === "title" && (
          <input
            type="text"
            value={section.value}
            onChange={(e) => updateSection(section.id, e.target.value)}
            placeholder="Nazwa projektu"
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:text-gray-100 dark:placeholder-gray-400"
          />
        )}

        {section.type === "description" && (
          <textarea
            value={section.value}
            onChange={(e) => updateSection(section.id, e.target.value)}
            placeholder="Opisz swój projekt"
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:text-gray-100 dark:placeholder-gray-400"
          />
        )}

        {section.type === "technologies" && (
          <div>
            <input
              type="text"
              value={section.value}
              onChange={(e) => updateSection(section.id, e.target.value)}
              placeholder="React, Node.js, MongoDB (oddziel przecinkami)"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:text-gray-100 dark:placeholder-gray-400"
            />
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Oddziel technologie przecinkami
            </p>
          </div>
        )}

        {section.type === "image" && (
          <div>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => handleImageChange(section.id, e.target.files)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:text-gray-100"
            />
            {section.value.length > 0 && (
              <div className="mt-3">
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                  Wybrano {section.value.length}{" "}
                  {section.value.length === 1 ? "zdjęcie" : "zdjęć"}
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {section.value.map((file, idx) => (
                    <div
                      key={idx}
                      className="relative h-20 bg-gray-100 dark:bg-gray-600 rounded border border-gray-300 dark:border-gray-500 overflow-hidden"
                    >
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`Preview ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1 truncate">
                        {file.name}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {(section.type === "github_url" || section.type === "live_url") && (
          <input
            type="url"
            value={section.value}
            onChange={(e) => updateSection(section.id, e.target.value)}
            placeholder={
              section.type === "github_url"
                ? "https://github.com/username/repo"
                : "https://example.com"
            }
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:text-gray-100 dark:placeholder-gray-400"
          />
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">
              Zbuduj swój projekt
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Dodawaj sekcje i dostosuj projekt do swoich potrzeb
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 dark:border-red-400 rounded-lg">
              <p className="text-red-700 dark:text-red-400 font-medium">{error}</p>
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500 dark:border-green-400 rounded-lg">
              <p className="text-green-700 dark:text-green-400 font-medium">
                Projekt utworzony  Sprawdź konsolę przeglądarki dla szczegółów.
              </p>
            </div>
          )}

          <div className="space-y-6">
            <div className="space-y-4">
              {sections.map((section, index) => renderSection(section, index))}
            </div>

            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 bg-gray-50 dark:bg-gray-700">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-3">
                Dodaj kolejną sekcję:
              </p>
              <div className="flex flex-wrap gap-2">
                {getAvailableTypes().map(([type, config]) => (
                  <button
                    key={type}
                    onClick={() => addSection(type)}
                    className="flex items-center space-x-2 px-4 py-2 bg-white dark:bg-gray-600 border-2 border-gray-300 dark:border-gray-500 rounded-lg hover:border-blue-500 dark:hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                  >
                    <span>{config.icon}</span>
                    <span className="text-sm font-medium dark:text-gray-200">{config.label}</span>
                    <Plus size={16} />
                  </button>
                ))}
              </div>
            </div>

            <div className="flex space-x-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="flex-1 px-6 py-3 bg-blue-600 dark:bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? "Tworzeni.." : "Utwórz projekt"}
              </button>
              <button
                onClick={() =>
                  setSections([
                    { id: Date.now(), type: "title", value: "", order: 0 },
                  ])
                }
                className="px-6 py-3 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 font-semibold rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-colors"
              >
                Resetuj
              </button>
            </div>
          </div>

          <details className="mt-8 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
            <summary className="cursor-pointer font-semibold text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-gray-100">
              Podgląd json
            </summary>
            <pre className="mt-4 p-4 bg-white dark:bg-gray-800 rounded border border-gray-300 dark:border-gray-600 overflow-x-auto text-xs dark:text-gray-300">
              {JSON.stringify(prepareSubmitData(), null, 2)}
            </pre>
          </details>

          <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <p className="text-sm text-blue-800 dark:text-blue-300">
              Otwórz konsolę
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DynamicProjectForm;