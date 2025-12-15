import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Trash2, GripVertical, Type, FileText, Code, Image as ImageIcon, Github, ExternalLink, X, Edit2, ArrowLeft } from "lucide-react";
import api from "../axios";
import TemplatePicker from "./TemplatePicker";
import TemplateCanvas from "./TemplateCanvas";
import TechnologyPicker from "./TechnologyPicker";
import { TEMPLATES } from "../templates/templates";
import { useNavigate, useParams } from "react-router-dom";

const getSECTION_TYPES = (t) => ({
  title: { label: t("sections.title"), multiple: false, icon: <Type size={18} /> },
  description: { label: t("sections.description"), multiple: true, icon: <FileText size={18} /> },
  technologies: { label: t("sections.technologies"), multiple: false, icon: <Code size={18} /> },
  image: { label: t("sections.image"), multiple: true, icon: <ImageIcon size={18} /> },
  github_url: { label: t("sections.githubUrl"), multiple: false, icon: <Github size={18} /> },
  live_url: { label: t("sections.liveUrl"), multiple: false, icon: <ExternalLink size={18} /> },
});

const getSECTION_CATEGORIES = (t) => ({
  podstawowe: {
    label: t("sections.categories.basic"),
    sections: ["title", "description"],
  },
  technologie: {
    label: t("sections.categories.technologies"),
    sections: ["technologies"],
  },
  linki: {
    label: t("sections.categories.links"),
    sections: ["github_url", "live_url"],
  },
  multimedia: {
    label: t("sections.categories.multimedia"),
    sections: ["image"],
  },
});

function EditProjectForm() {
  const { id } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const SECTION_TYPES = getSECTION_TYPES(t);
  const SECTION_CATEGORIES = getSECTION_CATEGORIES(t);
  const [sections, setSections] = useState([]);
  const [projectTitle, setProjectTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(Object.keys(SECTION_CATEGORIES)[0]);
  const [selectedTemplateId, setSelectedTemplateId] = useState(null);
  const [activeSlotId, setActiveSlotId] = useState(null);
  const [showTechnologyPicker, setShowTechnologyPicker] = useState(false);
  const [editingTechnologySectionId, setEditingTechnologySectionId] = useState(null);
  const [existingImages, setExistingImages] = useState([]); // Przechowuje istniejące zdjęcia z API
  
  const selectedTemplate = selectedTemplateId
    ? TEMPLATES.find((template) => template.id === selectedTemplateId)
    : null;
  const activeSlot = selectedTemplate?.slots.find((slot) => slot.id === activeSlotId);

  useEffect(() => {
    fetchProject();
  }, [id]);

  const fetchProject = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/projects/${id}`);
      const project = response.data;
      
      // Załaduj tytuł projektu
      setProjectTitle(project.data?.title || "");
      
      // Załaduj template
      setSelectedTemplateId(project.template_key || project.data?.template_key);
      
      // Załaduj sekcje
      const projectSections = project.data?.sections || [];
      const loadedSections = projectSections.map((section) => {
        if (section.type === "image") {
          // Dla sekcji image, znajdź istniejące zdjęcia
          const sectionImages = (project.images || []).filter(
            (img) => img.section_id === section.id
          );
          
          return {
            id: section.id,
            slotId: section.slot_id,
            type: section.type,
            value: sectionImages.map((img) => ({
              url: img.url, // URL istniejącego zdjęcia
              description: img.description || "",
              isExisting: true, // Oznacz jako istniejące
              imageId: img.id || img.url, // ID do identyfikacji
            })),
            order: section.order,
          };
        } else if (section.type === "technologies") {
          return {
            id: section.id,
            slotId: section.slot_id,
            type: section.type,
            value: Array.isArray(section.value) 
              ? section.value.join(", ") 
              : section.value || "",
            order: section.order,
          };
        } else {
          return {
            id: section.id,
            slotId: section.slot_id,
            type: section.type,
            value: section.value || "",
            order: section.order,
          };
        }
      });
      
      // Sortuj sekcje według order
      const sortedSections = loadedSections.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
      setSections(sortedSections);
      setExistingImages(project.images || []);
    } catch (err) {
      console.error("Error fetching project:", err);
      setError(t("errors.generic"));
    } finally {
      setLoading(false);
    }
  };

  const getDefaultValueForType = (type) => {
    if (type === "image") return [];
    return "";
  };

  const handleTemplateSelect = (templateId) => {
    if (templateId && templateId === selectedTemplateId) return;
    setSelectedTemplateId(templateId);
    // Nie resetuj sekcji podczas edycji - użytkownik może zmienić template
    setActiveSlotId(null);
    setIsModalOpen(false);
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

    if (type === "technologies") {
      setShowTechnologyPicker(true);
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
      value: preservedValue,
      order: templateOrder > -1 ? templateOrder : sections.length,
    };

    const updatedSections = [...otherSections, nextSection].sort(
      (a, b) => (a.order ?? 0) - (b.order ?? 0),
    );

    setSections(updatedSections);
    closeSlotModal();
  };

  const handleTechnologySave = (technologiesValue) => {
    if (!activeSlotId) return;

    const slotSection = sections.find((section) => section.slotId === activeSlotId);
    const otherSections = sections.filter((section) => section.slotId !== activeSlotId);

    const templateOrder = selectedTemplate
      ? selectedTemplate.slots.findIndex((slot) => slot.id === activeSlotId)
      : sections.length;

    const nextSection = {
      id: slotSection?.id || Date.now(),
      slotId: activeSlotId,
      type: "technologies",
      value: technologiesValue,
      order: templateOrder > -1 ? templateOrder : sections.length,
    };

    const updatedSections = [...otherSections, nextSection].sort(
      (a, b) => (a.order ?? 0) - (b.order ?? 0),
    );

    setSections(updatedSections);
    setShowTechnologyPicker(false);
    closeSlotModal();
  };

  const handleTechnologyCancel = () => {
    setShowTechnologyPicker(false);
    setEditingTechnologySectionId(null);
  };

  const handleEditTechnologies = (sectionId) => {
    setEditingTechnologySectionId(sectionId);
    setShowTechnologyPicker(true);
  };

  const handleEditTechnologySave = (technologiesValue) => {
    if (!editingTechnologySectionId) return;

    setSections((prev) =>
      prev.map((section) =>
        section.id === editingTechnologySectionId
          ? { ...section, value: technologiesValue }
          : section
      )
    );

    setShowTechnologyPicker(false);
    setEditingTechnologySectionId(null);
  };

  const closeSlotModal = () => {
    setIsModalOpen(false);
    setActiveSlotId(null);
    setShowTechnologyPicker(false);
    setEditingTechnologySectionId(null);
  };

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setIsModalOpen(false);
        setActiveSlotId(null);
        setShowTechnologyPicker(false);
        setEditingTechnologySectionId(null);
      }
    };

    const isAnyModalOpen = isModalOpen || (showTechnologyPicker && editingTechnologySectionId);

    if (isAnyModalOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isModalOpen, showTechnologyPicker, editingTechnologySectionId]);

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
    const fileArray = Array.from(files);
    const currentSection = sections.find(s => s.id === id);
    const currentImages = currentSection?.value || [];
    
    // Zachowaj istniejące zdjęcia (te z isExisting: true)
    const existingImages = currentImages.filter(img => img.isExisting);
    
    // Dodaj nowe pliki
    const newImages = fileArray.map(file => ({
      file: file,
      description: "",
      isExisting: false,
    }));
    
    updateSection(id, [...existingImages, ...newImages]);
  };

  const handleImageDescriptionChange = (sectionId, imageIndex, description) => {
    const currentSection = sections.find(s => s.id === sectionId);
    if (!currentSection) return;
    
    const updatedImages = [...currentSection.value];
    updatedImages[imageIndex] = {
      ...updatedImages[imageIndex],
      description: description
    };
    
    updateSection(sectionId, updatedImages);
  };

  const removeImage = (sectionId, imageIndex) => {
    const currentSection = sections.find(s => s.id === sectionId);
    if (!currentSection) return;
    
    const updatedImages = currentSection.value.filter((_, idx) => idx !== imageIndex);
    updateSection(sectionId, updatedImages);
  };

  const validate = () => {
    if (!selectedTemplate) {
      setError(t("projects.form.selectTemplate"));
      return false;
    }

    if (!projectTitle || projectTitle.trim() === "") {
      setError(t("projects.form.titleRequired"));
      return false;
    }

    if (sections.length === 0) {
      setError(t("projects.form.selectTemplateError"));
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
      title: projectTitle.trim(),
      sections: orderedSections.map((section, index) => {
        if (section.type === "image") {
          // Dla sekcji image, wyślij tylko nowe zdjęcia (te z file)
          const newImages = section.value.filter(img => !img.isExisting && img.file);
          return {
            id: section.id,
            type: section.type,
            order: index,
            slot_id: section.slotId,
            image_ids: newImages.map((_, idx) => `${section.id}_${idx}`),
            image_descriptions: newImages.map((img, idx) => ({
              index: idx,
              description: img.description || ""
            })),
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

    setSaving(true);

    try {
      const projectData = prepareSubmitData();
      const formData = new FormData();
      
      formData.append("data", JSON.stringify(projectData));
      formData.append("template_key", selectedTemplateId);
      
      // Dodaj tylko nowe zdjęcia (te z file, nie istniejące)
      sections.forEach((section) => {
        if (section.type === "image" && section.value.length > 0) {
          const newImages = section.value.filter(img => !img.isExisting && img.file);
          newImages.forEach((imgObj, idx) => {
            const key = `${section.id}_${idx}`;
            formData.append(`images[${key}]`, imgObj.file);
            if (imgObj.description) {
              formData.append(`image_descriptions[${key}]`, imgObj.description);
            }
          });
        }
      });

      await api.patch(`/projects/${id}`, formData, {
        headers: {
          // NIE ustawiaj Content-Type - przeglądarka zrobi to automatycznie z boundary
        },
      });
      
      setSuccess(true);
      setTimeout(() => navigate(`/projects/${id}`), 500);
    } catch (err) {
      console.error("Błąd podczas aktualizacji projektu:", err);
      setError(
        err.response?.data?.error || 
        err.response?.data?.errors?.join(", ") ||
        t("errors.generic")
      );
    } finally {
      setSaving(false);
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
            </h3>
          </div>
          <button
            onClick={() => removeSection(section.id)}
            className="p-1 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
          >
            <Trash2 size={18} />
          </button>
        </div>

        {section.type === "title" && (
          <textarea
            value={section.value}
            onChange={(e) => updateSection(section.id, e.target.value)}
            placeholder={t("sections.title")}
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:text-gray-100 dark:placeholder-gray-400 text-lg font-bold"
          />
        )}

        {section.type === "description" && (
          <textarea
            value={section.value}
            onChange={(e) => updateSection(section.id, e.target.value)}
            placeholder={t("common.description")}
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:text-gray-100 dark:placeholder-gray-400"
          />
        )}

        {section.type === "technologies" && (
          <div>
            {section.value ? (
              <div className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  {section.value
                    .split(",")
                    .map((tech) => tech.trim())
                    .filter((tech) => tech.length > 0)
                    .map((tech, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center px-3 py-1 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium"
                      >
                        {tech}
                      </span>
                    ))}
                </div>
                <button
                  type="button"
                  onClick={() => handleEditTechnologies(section.id)}
                  className="flex items-center space-x-2 px-3 py-1.5 text-sm font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                >
                  <Edit2 size={16} />
                  <span>{t("titlePages.sections.technologies.edit")}</span>
                </button>
              </div>
            ) : (
              <div className="text-center py-4 text-gray-500 dark:text-gray-400">
                <p className="text-sm mb-2">{t("titlePages.sections.technologies.empty")}</p>
                <button
                  type="button"
                  onClick={() => handleEditTechnologies(section.id)}
                  className="px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                >
                  {t("titlePages.sections.technologies.add")}
                </button>
              </div>
            )}
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
              <div className="mt-3 space-y-4">
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {t("sections.selectImages")} {section.value.length}{" "}
                  {t("sections.imagesSelected")}
                </p>
                <div className="space-y-4">
                  {section.value.map((imgObj, idx) => (
                    <div
                      key={idx}
                      className="border border-gray-200 dark:border-gray-600 rounded-lg p-3 bg-gray-50 dark:bg-gray-700"
                    >
                      <div className="flex items-start gap-3">
                        <div className="relative h-24 w-24 bg-gray-100 dark:bg-gray-600 rounded border border-gray-300 dark:border-gray-500 overflow-hidden flex-shrink-0">
                          {imgObj.isExisting ? (
                            <img
                              src={imgObj.url}
                              alt={`Existing ${idx + 1}`}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <img
                              src={URL.createObjectURL(imgObj.file)}
                              alt={`Preview ${idx + 1}`}
                              className="w-full h-full object-cover"
                            />
                          )}
                          <button
                            type="button"
                            onClick={() => removeImage(section.id, idx)}
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                            title={t("common.delete")}
                          >
                            <X size={14} />
                          </button>
                          {imgObj.isExisting && (
                            <span className="absolute bottom-1 left-1 bg-blue-500 text-white text-xs px-1 rounded">
                              {t("common.existing")}
                            </span>
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 truncate">
                            {imgObj.isExisting ? imgObj.url.split('/').pop() : imgObj.file.name}
                          </p>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            {t("sections.imageDescription")}
                          </label>
                          <textarea
                            value={imgObj.description || ""}
                            onChange={(e) => handleImageDescriptionChange(section.id, idx, e.target.value)}
                            placeholder={t("sections.imageDescriptionPlaceholder")}
                            rows={2}
                            className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:text-gray-100 dark:placeholder-gray-400"
                          />
                        </div>
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <p className="text-gray-600 dark:text-gray-300">{t("common.loading")}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
          <button
            onClick={() => navigate(`/projects/${id}`)}
            className="mb-6 flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
          >
            <ArrowLeft size={20} />
            <span>{t("common.back")}</span>
          </button>

          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">
              {t("projects.form.edit")}
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              {t("projects.form.builderSubtitle")}
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
                {t("projects.form.edit")} {t("common.success")}
              </p>
            </div>
          )}

          <div className="space-y-8">
            {selectedTemplate && (
              <div className="space-y-6">
                <div className="rounded-xl border border-gray-200 bg-gray-50 p-5 dark:border-gray-700 dark:bg-gray-900">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                        {t("projects.form.template")}
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
                      {t("projects.form.changeTemplate")}
                    </button>
                  </div>
                </div>

                {/* Pole tytułu projektu */}
                <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-800">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t("projects.form.projectTitle")} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={projectTitle}
                    onChange={(e) => setProjectTitle(e.target.value)}
                    placeholder={t("projects.form.projectTitlePlaceholder")}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-400"
                  />
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

            {!selectedTemplate && (
              <TemplatePicker
                selectedTemplateId={selectedTemplateId}
                onSelect={handleTemplateSelect}
              />
            )}

            {/* Modal dla edycji technologii (poza kontekstem wyboru sekcji) */}
            {showTechnologyPicker && editingTechnologySectionId && !isModalOpen && (
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
                  <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                    <div>
                      <p className="text-sm uppercase tracking-wide text-gray-500 dark:text-gray-400">
                        {t("titlePages.sections.technologies.edit")}
                      </p>
                      <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                        {t("sections.technologies")}
                      </h2>
                    </div>
                    <button
                      onClick={closeSlotModal}
                      className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    >
                      <X size={24} />
                    </button>
                  </div>
                  <div className="flex-1 overflow-y-auto p-6">
                    <TechnologyPicker
                      initialValue={
                        sections.find((s) => s.id === editingTechnologySectionId)?.value || ""
                      }
                      onSave={handleEditTechnologySave}
                      onCancel={handleTechnologyCancel}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Modal */}
            {(isModalOpen || (showTechnologyPicker && !editingTechnologySectionId)) && selectedTemplate && (
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
                  <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                    <div>
                      <p className="text-sm uppercase tracking-wide text-gray-500 dark:text-gray-400">
                        {showTechnologyPicker
                          ? editingTechnologySectionId
                            ? t("titlePages.sections.technologies.edit")
                            : t("sections.addSectionToSlot")
                          : t("sections.addSectionToSlot")}
                      </p>
                      <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                        {showTechnologyPicker
                          ? editingTechnologySectionId
                            ? t("sections.technologies")
                            : activeSlot?.label || "Slot"
                          : activeSlot?.label || "Slot"}
                      </h2>
                    </div>
                    <button
                      onClick={closeSlotModal}
                      className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    >
                      <X size={24} />
                    </button>
                  </div>

                  {showTechnologyPicker ? (
                    <div className="flex-1 overflow-y-auto p-6">
                      <TechnologyPicker
                        initialValue={
                          editingTechnologySectionId
                            ? sections.find((s) => s.id === editingTechnologySectionId)?.value || ""
                            : ""
                        }
                        onSave={
                          editingTechnologySectionId
                            ? handleEditTechnologySave
                            : handleTechnologySave
                        }
                        onCancel={handleTechnologyCancel}
                      />
                    </div>
                  ) : (
                    <div className="flex flex-1 overflow-hidden">
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
                              {t("sections.noSectionsAvailable")}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="flex space-x-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={handleSubmit}
                disabled={saving}
                className="flex-1 px-6 py-3 bg-blue-600 dark:bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {saving ? t("common.loading") : t("common.save")}
              </button>
              <button
                onClick={() => navigate(`/projects/${id}`)}
                className="px-6 py-3 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 font-semibold rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-colors"
              >
                {t("common.cancel")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditProjectForm;
