import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import api from "../axios";
import { ArrowLeft, Save, Plus, Trash2, X, Languages, Code, Edit2, Share2 } from "lucide-react";
import TechnologyPicker from "./TechnologyPicker";
import LanguagePicker from "./LanguagePicker";
import SocialMediaPicker from "./SocialMediaPicker";

const SECTION_TYPES = {
  languages: { labelKey: "titlePages.sections.languages.title", icon: <Languages size={18} /> },
  technologies: { labelKey: "titlePages.sections.technologies.title", icon: <Code size={18} /> },
  social_media: { labelKey: "titlePages.sections.socialMedia.title", icon: <Share2 size={18} /> },
};

function TitlePageForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
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
  const [sections, setSections] = useState([]);
  const [showAddSectionModal, setShowAddSectionModal] = useState(false);
  const [showTechnologyPicker, setShowTechnologyPicker] = useState(false);
  const [showLanguagePicker, setShowLanguagePicker] = useState(false);
  const [showSocialMediaPicker, setShowSocialMediaPicker] = useState(false);
  const [editingSectionId, setEditingSectionId] = useState(null);

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
      if (page.sections && Array.isArray(page.sections)) {
        setSections(page.sections);
      }
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

  const addSection = (type) => {
    if (type === "technologies") {
      setShowTechnologyPicker(true);
      setEditingSectionId(null);
    } else if (type === "languages") {
      setShowLanguagePicker(true);
      setEditingSectionId(null);
    } else if (type === "social_media") {
      setShowSocialMediaPicker(true);
      setEditingSectionId(null);
    }
    setShowAddSectionModal(false);
  };

  const handleTechnologySave = (technologiesValue) => {
    if (editingSectionId) {
      setSections(sections.map(section => 
        section.id === editingSectionId 
          ? { ...section, value: technologiesValue }
          : section
      ));
    } else {
      const newSection = {
        id: Date.now(),
        type: "technologies",
        value: technologiesValue,
        order: sections.length
      };
      setSections([...sections, newSection]);
    }
    setShowTechnologyPicker(false);
    setEditingSectionId(null);
  };

  const handleLanguageSave = (languagesValue) => {
    if (editingSectionId) {
      setSections(sections.map(section => 
        section.id === editingSectionId 
          ? { ...section, value: languagesValue }
          : section
      ));
    } else {
      const newSection = {
        id: Date.now(),
        type: "languages",
        value: languagesValue,
        order: sections.length
      };
      setSections([...sections, newSection]);
    }
    setShowLanguagePicker(false);
    setEditingSectionId(null);
  };

  const handleSocialMediaSave = (socialMediaValue) => {
    if (editingSectionId) {
      setSections(sections.map(section => 
        section.id === editingSectionId 
          ? { ...section, value: socialMediaValue }
          : section
      ));
    } else {
      const newSection = {
        id: Date.now(),
        type: "social_media",
        value: socialMediaValue,
        order: sections.length
      };
      setSections([...sections, newSection]);
    }
    setShowSocialMediaPicker(false);
    setEditingSectionId(null);
  };

  const removeSection = (sectionId) => {
    setSections(sections.filter(section => section.id !== sectionId));
  };

  const editSection = (section) => {
    setEditingSectionId(section.id);
    if (section.type === "technologies") {
      setShowTechnologyPicker(true);
    } else if (section.type === "languages") {
      setShowLanguagePicker(true);
    } else if (section.type === "social_media") {
      setShowSocialMediaPicker(true);
    }
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
      submitData.append("sections", JSON.stringify(sections));

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
        t("errors.generic")
      );
    } finally {
      setLoading(false);
    }
  };

  const getTITLE_TEMPLATES = () => [
    {
      id: "titleTemplate1",
      name: t("titlePages.templates.template1.name"),
      description: t("titlePages.templates.template1.description")
    },
    {
      id: "titleTemplate2",
      name: t("titlePages.templates.template2.name"),
      description: t("titlePages.templates.template2.description")
    },
    {
      id: "titleTemplate3",
      name: t("titlePages.templates.template3.name"),
      description: t("titlePages.templates.template3.description")
    }
  ];

  if (loadingData) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <p className="text-gray-600 dark:text-gray-300">{t("common.loading")}</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => navigate("/title_pages")}
          className="mb-6 flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
        >
          <ArrowLeft size={20} />
          <span>{t("titlePages.view.back")}</span>
        </button>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6">
            {isEditing ? t("titlePages.form.edit") : t("titlePages.form.create")}
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
                {t("titlePages.form.template")}
              </label>
              <div className="grid gap-4 md:grid-cols-3">
                {getTITLE_TEMPLATES().map((template) => (
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
                {t("titlePages.form.photo")}
              </label>
              {existingPhotoUrl && !photo && (
                <div className="mb-4">
                  <img
                    src={existingPhotoUrl}
                    alt={t("titlePages.form.currentPhoto")}
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
                  {t("titlePages.form.selected")}: {photo.name}
                </p>
              )}
            </div>

            {/* Dane kontaktowe */}
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t("titlePages.form.phone")}
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
                  {t("titlePages.form.email")}
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
                {t("titlePages.form.address")}
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
                {t("titlePages.form.bio")}
              </label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100"
                placeholder={t("titlePages.form.bioPlaceholder")}
              />
            </div>

            {/* Doświadczenie */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t("titlePages.form.experience.title")}
                </label>
                <button
                  type="button"
                  onClick={addExperience}
                  className="px-3 py-1 text-sm bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600"
                >
                  {t("titlePages.form.experience.add")}
                </button>
              </div>
              {formData.experience.map((exp, index) => (
                <div key={index} className="mb-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="grid gap-4 md:grid-cols-2 mb-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                        {t("titlePages.form.experience.company")}
                      </label>
                      <input
                        type="text"
                        value={exp.company || ""}
                        onChange={(e) => handleExperienceChange(index, "company", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-600 dark:text-gray-100 text-sm"
                        placeholder={t("titlePages.form.experience.company")}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                        {t("titlePages.form.experience.position")}
                      </label>
                      <input
                        type="text"
                        value={exp.position || ""}
                        onChange={(e) => handleExperienceChange(index, "position", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-600 dark:text-gray-100 text-sm"
                        placeholder={t("titlePages.form.experience.position")}
                      />
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                      {t("titlePages.form.experience.period")}
                    </label>
                    <input
                      type="text"
                      value={exp.period || ""}
                      onChange={(e) => handleExperienceChange(index, "period", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-600 dark:text-gray-100 text-sm"
                      placeholder={t("titlePages.form.experience.periodPlaceholder")}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                      {t("titlePages.form.experience.description")}
                    </label>
                    <textarea
                      value={exp.description || ""}
                      onChange={(e) => handleExperienceChange(index, "description", e.target.value)}
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-600 dark:text-gray-100 text-sm"
                      placeholder={t("titlePages.form.experience.descriptionPlaceholder")}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeExperience(index)}
                    className="text-sm text-red-600 dark:text-red-400 hover:underline"
                  >
                    {t("common.delete")}
                  </button>
                </div>
              ))}
              {formData.experience.length === 0 && (
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                  {t("titlePages.form.experience.empty")}
                </p>
              )}
            </div>

            {/* Sekcje dynamiczne */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t("titlePages.form.sections.title")}
                </label>
                <button
                  type="button"
                  onClick={() => setShowAddSectionModal(true)}
                  className="flex items-center space-x-2 px-3 py-1 text-sm bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600"
                >
                  <Plus size={16} />
                  <span>{t("titlePages.form.sections.add")}</span>
                </button>
              </div>

              {sections.length > 0 && (
                <div className="space-y-4">
                  {sections.map((section) => (
                    <div
                      key={section.id}
                      className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          {SECTION_TYPES[section.type]?.icon}
                          <h3 className="font-semibold text-gray-800 dark:text-gray-200">
                            {t(SECTION_TYPES[section.type]?.labelKey || section.type)}
                          </h3>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            type="button"
                            onClick={() => editSection(section)}
                            className="p-1 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            type="button"
                            onClick={() => removeSection(section.id)}
                            className="p-1 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>

                      {section.type === "technologies" && (
                        <div>
                          {section.value ? (
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
                          ) : (
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {t("titlePages.sections.technologies.empty")}
                            </p>
                          )}
                        </div>
                      )}

                      {section.type === "languages" && (
                        <div>
                          {Array.isArray(section.value) && section.value.length > 0 ? (
                            <div className="space-y-2">
                              {section.value.map((lang, idx) => (
                                <div
                                  key={lang.id || idx}
                                  className="flex items-center justify-between p-2 bg-white dark:bg-gray-600 rounded"
                                >
                                  <span className="font-medium text-gray-800 dark:text-gray-200">
                                    {(() => {
                                      const LANGUAGE_NAME_TO_KEY = {
                                        "Polski": "polish", "Angielski": "english", "Niemiecki": "german",
                                        "Francuski": "french", "Hiszpański": "spanish", "Włoski": "italian",
                                        "Rosyjski": "russian", "Chiński": "chinese", "Japoński": "japanese",
                                        "Koreański": "korean", "Portugalski": "portuguese", "Holenderski": "dutch",
                                        "Szwedzki": "swedish", "Norweski": "norwegian", "Duński": "danish",
                                        "Czeski": "czech", "Słowacki": "slovak", "Ukraiński": "ukrainian",
                                        "Węgierski": "hungarian", "Rumuński": "romanian"
                                      };
                                      const languageKey = LANGUAGE_NAME_TO_KEY[lang.name] || lang.name?.toLowerCase() || lang.name;
                                      return t(`titlePages.languageNames.${languageKey}`, { defaultValue: lang.name });
                                    })()}
                                  </span>
                                  <span className="px-2 py-1 bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 rounded text-sm">
                                    {lang.level === "ojczysty" ? t("titlePages.sections.languages.native") : lang.level}
                                  </span>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {t("titlePages.sections.languages.empty")}
                            </p>
                          )}
                        </div>
                      )}

                      {section.type === "social_media" && (
                        <div>
                          {Array.isArray(section.value) && section.value.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                              {section.value.map((link, idx) => (
                                <div
                                  key={idx}
                                  className="flex items-center space-x-2 px-3 py-2 bg-white dark:bg-gray-600 rounded border border-gray-200 dark:border-gray-500"
                                >
                                  <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                                    {t(`titlePages.socialMedia.platforms.${link.platform}`)}
                                  </span>
                                  <span className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[150px]">
                                    {link.url}
                                  </span>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {t("titlePages.sections.socialMedia.empty")}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {sections.length === 0 && (
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                  {t("titlePages.form.sections.empty")}
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
                <span>{loading ? t("common.loading") : (isEditing ? t("titlePages.form.edit") : t("common.save"))}</span>
              </button>
              <button
                type="button"
                onClick={() => navigate("/title_pages")}
                className="px-6 py-3 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 font-semibold rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-colors"
              >
                {t("common.cancel")}
              </button>
            </div>
          </form>
        </div>

        {/* Modal wyboru typu sekcji */}
        {showAddSectionModal && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 dark:bg-black/30 backdrop-blur-sm"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setShowAddSectionModal(false);
              }
            }}
          >
            <div
              className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">
                  {t("titlePages.form.sections.selectType")}
                </h2>
                <button
                  onClick={() => setShowAddSectionModal(false)}
                  className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <X size={24} />
                </button>
              </div>
              <div className="space-y-3">
                {Object.entries(SECTION_TYPES).map(([type, config]) => (
                  <button
                    key={type}
                    onClick={() => addSection(type)}
                    className="w-full flex items-center space-x-3 p-4 bg-gray-50 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-lg hover:border-blue-500 dark:hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all text-left"
                  >
                    <span className="text-gray-600 dark:text-gray-400">{config.icon}</span>
                    <span className="font-medium text-gray-700 dark:text-gray-200">
                      {t(config.labelKey)}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Modal TechnologyPicker */}
        {showTechnologyPicker && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 dark:bg-black/30 backdrop-blur-sm"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setShowTechnologyPicker(false);
                setEditingSectionId(null);
              }
            }}
          >
            <div
              className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-4xl max-h-[80vh] flex flex-col overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">
                  {editingSectionId ? t("titlePages.sections.technologies.edit") : t("titlePages.sections.technologies.add")}
                </h2>
                <button
                  onClick={() => {
                    setShowTechnologyPicker(false);
                    setEditingSectionId(null);
                  }}
                  className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <X size={24} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-6">
                <TechnologyPicker
                  initialValue={
                    editingSectionId
                      ? sections.find((s) => s.id === editingSectionId)?.value || ""
                      : ""
                  }
                  onSave={handleTechnologySave}
                  onCancel={() => {
                    setShowTechnologyPicker(false);
                    setEditingSectionId(null);
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Modal LanguagePicker */}
        {showLanguagePicker && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 dark:bg-black/30 backdrop-blur-sm"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setShowLanguagePicker(false);
                setEditingSectionId(null);
              }
            }}
          >
            <div
              className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-4xl max-h-[80vh] flex flex-col overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">
                  {editingSectionId ? t("titlePages.sections.languages.edit") : t("titlePages.sections.languages.add")}
                </h2>
                <button
                  onClick={() => {
                    setShowLanguagePicker(false);
                    setEditingSectionId(null);
                  }}
                  className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <X size={24} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-6">
                <LanguagePicker
                  initialValue={
                    editingSectionId
                      ? sections.find((s) => s.id === editingSectionId)?.value || []
                      : []
                  }
                  onSave={handleLanguageSave}
                  onCancel={() => {
                    setShowLanguagePicker(false);
                    setEditingSectionId(null);
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Modal SocialMediaPicker */}
        {showSocialMediaPicker && (
          <SocialMediaPicker
            initialValue={
              editingSectionId
                ? sections.find((s) => s.id === editingSectionId)?.value || []
                : []
            }
            onSave={handleSocialMediaSave}
            onCancel={() => {
              setShowSocialMediaPicker(false);
              setEditingSectionId(null);
            }}
          />
        )}
      </div>
  );
}

export default TitlePageForm;

