import React, { useState, useEffect } from "react";
import { Trash2, GripVertical, Type, FileText, Code, Image as ImageIcon, Github, ExternalLink, X } from "lucide-react";
import api from "../axios";
import TemplatePicker from "./TemplatePicker";
import TemplateCanvas from "./TemplateCanvas";
import { TEMPLATES } from "../templates/templates";
import { useNavigate } from "react-router-dom";

const SECTION_TYPES = {
  title: { label: "Tytuł", multiple: false, icon: <Type size={18} /> },
  description: { label: "Opis", multiple: true, icon: <FileText size={18} /> },
  technologies: { label: "Technologie", multiple: false, icon: <Code size={18} /> },
  image: { label: "Zdjęcie", multiple: true, icon: <ImageIcon size={18} /> },
  github_url: { label: "Link GitHub", multiple: false, icon: <Github size={18} /> },
  live_url: { label: "Link Live", multiple: false, icon: <ExternalLink size={18} /> },
};

const SECTION_CATEGORIES = {
  podstawowe: {
    label: "Podstawowe",
    sections: ["title", "description"],
  },
  technologie: {
    label: "Technologie",
    sections: ["technologies"],
  },
  linki: {
    label: "Linki",
    sections: ["github_url", "live_url"],
  },
  multimedia: {
    label: "Multimedia",
    sections: ["image"],
  },
};

function DynamicProjectForm() {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(Object.keys(SECTION_CATEGORIES)[0]);
  const [selectedTemplateId, setSelectedTemplateId] = useState(null);
  const [activeSlotId, setActiveSlotId] = useState(null);
  const navigate = useNavigate();
  const selectedTemplate = selectedTemplateId
    ? TEMPLATES.find((template) => template.id === selectedTemplateId)
    : null;
  const activeSlot = selectedTemplate?.slots.find((slot) => slot.id === activeSlotId);

  const getDefaultValueForType = (type) => {
    if (type === "image") return [];
    return "";
  };

  const handleTemplateSelect = (templateId) => {
    if (templateId && templateId === selectedTemplateId) return;
    setSelectedTemplateId(templateId);
    setSections([]);
    setActiveSlotId(null);
    setIsModalOpen(false);
    setSuccess(false);
    setSelectedCategory(Object.keys(SECTION_CATEGORIES)[0]);
  };

  const handleSlotClick = (slotId) => {
    if (!selectedTemplate) return;
    setActiveSlotId(slotId);
    setSelectedCategory(Object.keys(SECTION_CATEGORIES)[0]);
    setIsModalOpen(true);
  };

  const handleSlotClear = (slotId) => {
    setSections((prev) => prev.filter((section) => section.slotId !== slotId));
    if (activeSlotId === slotId) {
      closeSlotModal();
    }
  };

  const assignSectionToSlot = (type) => {
    if (!activeSlotId) return;
    const slotSection = sections.find((section) => section.slotId === activeSlotId);
    const otherSections = sections.filter((section) => section.slotId !== activeSlotId);

    if (!SECTION_TYPES[type].multiple && otherSections.some((section) => section.type === type)) {
      return;
    }

    const templateOrder = selectedTemplate
      ? selectedTemplate.slots.findIndex((slot) => slot.id === activeSlotId)
      : sections.length;

    const preservedValue =
      slotSection && slotSection.type === type ? slotSection.value : getDefaultValueForType(type);

    const nextSection = {
      id: slotSection?.id || Date.now(),
      slotId: activeSlotId,
      type,
      value:
        type === "technologies"
          ? typeof preservedValue === "string"
            ? preservedValue
            : ""
          : preservedValue,
      order: templateOrder > -1 ? templateOrder : sections.length,
    };

    const updatedSections = [...otherSections, nextSection].sort(
      (a, b) => (a.order ?? 0) - (b.order ?? 0),
    );

    setSections(updatedSections);
    closeSlotModal();
  };

  const closeSlotModal = () => {
    setIsModalOpen(false);
    setActiveSlotId(null);
  };

  // Zamykanie modala po kliknięciu w tło
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setIsModalOpen(false);
      }
    };

    if (isModalOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isModalOpen]);

  const removeSection = (id) => {
    const sectionToRemove = sections.find((section) => section.id === id);
    if (sectionToRemove?.slotId === activeSlotId) {
      closeSlotModal();
    }
    setSections(sections.filter((section) => section.id !== id));
  };

  const updateSection = (id, value) => {
    setSections(sections.map((s) => (s.id === id ? { ...s, value } : s)));
  };

  const handleImageChange = (id, files) => {
    updateSection(id, Array.from(files));
  };

  const resetBuilder = () => {
    setSections([]);
    setSelectedTemplateId(null);
    setActiveSlotId(null);
    setIsModalOpen(false);
    setError(null);
    setSuccess(false);
    setSelectedCategory(Object.keys(SECTION_CATEGORIES)[0]);
  };

  const validate = () => {
    if (!selectedTemplate) {
      setError("Wybierz template, aby kontynuować.");
      return false;
    }

    if (sections.length === 0) {
      setError("Dodaj co najmniej jedną sekcję do wybranego template'u.");
      return false;
    }

    const titleSection = sections.find((s) => s.type === "title");
    if (!titleSection || !titleSection.value.trim()) {
      setError("Tytuł projektu jest wymagany");
      return false;
    }
    return true;
  };

  const prepareSubmitData = () => {
    const orderedSections = selectedTemplate
      ? selectedTemplate.slots
          .map((slot) => sections.find((section) => section.slotId === slot.id))
          .filter(Boolean)
      : sections;

    const projectData = {
      template_key: selectedTemplateId,
      sections: orderedSections.map((section, index) => {
        if (section.type === "image") {
          return {
            id: section.id,
            type: section.type,
            order: index,
            slot_id: section.slotId,
            image_ids: section.value.map((_, idx) => `${section.id}_${idx}`),
          };
        } else if (section.type === "technologies") {
          return {
            id: section.id,
            type: section.type,
            order: index,
            slot_id: section.slotId,
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
            slot_id: section.slotId,
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
      
      // Dodaj dane JSON i template
      formData.append("data", JSON.stringify(projectData));
      formData.append("template_key", selectedTemplateId);
      
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
      console.log("XD");
      setTimeout(() => navigate(`/projects/${response.data.id}`), 500);
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

  const getAvailableSectionsInCategory = (categoryKey, slotId = activeSlotId) => {
    const category = SECTION_CATEGORIES[categoryKey];
    if (!category || !slotId) return [];
    
    const slotSection = sections.find((section) => section.slotId === slotId);
    const existingTypes = sections
      .filter((section) => section.slotId !== slotId)
      .map((section) => section.type);

    return category.sections
      .map((type) => [type, SECTION_TYPES[type]])
      .filter(([type, config]) => {
        if (config.multiple) return true;
        if (slotSection?.type === type) return true;
        return !existingTypes.includes(type);
      });
  };

  const renderSection = (section) => {
    const config = SECTION_TYPES[section.type];

    return (
      <div className="bg-white dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-lg p-4 hover:border-blue-300 dark:hover:border-blue-500 transition-colors">
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

          <div className="space-y-8">
            {!selectedTemplate && (
              <TemplatePicker
                selectedTemplateId={selectedTemplateId}
                onSelect={handleTemplateSelect}
              />
            )}

            {selectedTemplate && (
              <div className="space-y-6">
                <div className="rounded-xl border border-gray-200 bg-gray-50 p-5 dark:border-gray-700 dark:bg-gray-900">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                        Wybrany template
                      </p>
                      <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                        {selectedTemplate.name}
                      </h2>
                      <p className="text-gray-600 dark:text-gray-300">{selectedTemplate.description}</p>
                    </div>
                    <button
                      onClick={() => handleTemplateSelect(null)}
                      className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-800"
                    >
                      Zmień template
                    </button>
                  </div>
                </div>

                <TemplateCanvas
                  template={selectedTemplate}
                  sections={sections}
                  onSlotClick={handleSlotClick}
                  renderSection={renderSection}
                  onClearSlot={handleSlotClear}
                />
              </div>
            )}

            {/* Modal */}
            {isModalOpen && selectedTemplate && (
              <div
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 dark:bg-black/30 backdrop-blur-sm"
                onClick={(e) => {
                  if (e.target === e.currentTarget) {
                    closeSlotModal();
                  }
                }}
              >
                <div
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-4xl max-h-[80vh] flex flex-col overflow-hidden"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Header */}
                  <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                    <div>
                      <p className="text-sm uppercase tracking-wide text-gray-500 dark:text-gray-400">
                        Dodaj sekcję do slotu
                      </p>
                      <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                        {activeSlot?.label || "Slot"}
                      </h2>
                    </div>
                    <button
                      onClick={closeSlotModal}
                      className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    >
                      <X size={24} />
                    </button>
                  </div>

                  {/* Content */}
                  <div className="flex flex-1 overflow-hidden">
                    {/* Left Column - Categories */}
                    <div className="w-64 border-r border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 overflow-y-auto">
                      <div className="p-4 space-y-2">
                        {Object.entries(SECTION_CATEGORIES).map(([key, category]) => {
                          const availableCount = getAvailableSectionsInCategory(key).length;
                          return (
                            <button
                              key={key}
                              onClick={() => setSelectedCategory(key)}
                              className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                                selectedCategory === key
                                  ? "bg-blue-600 dark:bg-blue-500 text-white font-semibold"
                                  : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <span>{category.label}</span>
                                {availableCount > 0 && (
                                  <span
                                    className={`text-xs px-2 py-1 rounded-full ${
                                      selectedCategory === key
                                        ? "bg-blue-500 dark:bg-blue-600 text-white"
                                        : "bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300"
                                    }`}
                                  >
                                    {availableCount}
                                  </span>
                                )}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Right Panel - Sections */}
                    <div className="flex-1 overflow-y-auto p-6">
                      {getAvailableSectionsInCategory(selectedCategory).length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {getAvailableSectionsInCategory(selectedCategory).map(([type, config]) => (
                            <button
                              key={type}
                              onClick={() => assignSectionToSlot(type)}
                              className="flex items-center space-x-3 p-4 bg-white dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-lg hover:border-blue-500 dark:hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all text-left"
                            >
                              <span className="text-gray-600 dark:text-gray-400">{config.icon}</span>
                              <span className="font-medium text-gray-700 dark:text-gray-200">
                                {config.label}
                              </span>
                            </button>
                          ))}
                        </div>
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <p className="text-gray-500 dark:text-gray-400 text-center">
                            Brak dostępnych sekcji dla tego slotu w tej kategorii
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="flex space-x-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="flex-1 px-6 py-3 bg-blue-600 dark:bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? "Tworzeni.." : "Utwórz projekt"}
              </button>
              <button
                onClick={resetBuilder}
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