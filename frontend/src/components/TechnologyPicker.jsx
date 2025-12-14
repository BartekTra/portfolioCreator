import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { X, Check } from "lucide-react";

// Mapa technologii z możliwością łatwego dodania ikon
// Struktura pozwala na łatwe dodanie ikon w przyszłości (np. z react-icons)
export const TECHNOLOGIES = {
  frontend: {
    label: "Frontend",
    technologies: [
      { id: "react", name: "React", icon: null },
      { id: "javascript", name: "JavaScript", icon: null },
      { id: "typescript", name: "TypeScript", icon: null },
      { id: "vue", name: "Vue.js", icon: null },
      { id: "angular", name: "Angular", icon: null },
      { id: "html", name: "HTML", icon: null },
      { id: "css", name: "CSS", icon: null },
      { id: "sass", name: "SASS", icon: null },
      { id: "tailwind", name: "Tailwind CSS", icon: null },
    ],
  },
  backend: {
    label: "Backend",
    technologies: [
      { id: "nodejs", name: "Node.js", icon: null },
      { id: "python", name: "Python", icon: null },
      { id: "ruby", name: "Ruby on Rails", icon: null },
      { id: "java", name: "Java", icon: null },
      { id: "php", name: "PHP", icon: null },
      { id: "go", name: "Go", icon: null },
      { id: "cpp", name: "C++", icon: null },
      { id: "csharp", name: "C#", icon: null },
      { id: "rust", name: "Rust", icon: null },
    ],
  },
  mobile: {
    label: "Mobile",
    technologies: [
      { id: "swift", name: "Swift", icon: null },
      { id: "kotlin", name: "Kotlin", icon: null },
      { id: "react-native", name: "React Native", icon: null },
      { id: "flutter", name: "Flutter", icon: null },
    ],
  },
  database: {
    label: "Bazy danych",
    technologies: [
      { id: "postgresql", name: "PostgreSQL", icon: null },
      { id: "mysql", name: "MySQL", icon: null },
      { id: "mongodb", name: "MongoDB", icon: null },
      { id: "redis", name: "Redis", icon: null },
      { id: "sqlite", name: "SQLite", icon: null },
    ],
  },
  devops: {
    label: "DevOps & Narzędzia",
    technologies: [
      { id: "docker", name: "Docker", icon: null },
      { id: "kubernetes", name: "Kubernetes", icon: null },
      { id: "aws", name: "AWS", icon: null },
      { id: "git", name: "Git", icon: null },
      { id: "linux", name: "Linux", icon: null },
    ],
  },
};

// Funkcja pomocnicza do parsowania wartości technologii (string oddzielony przecinkami)
const parseTechnologies = (value) => {
  if (!value || typeof value !== "string") return [];
  return value
    .split(",")
    .map((tech) => tech.trim())
    .filter((tech) => tech.length > 0);
};

// Funkcja pomocnicza do formatowania technologii (tablica -> string)
const formatTechnologies = (technologies) => {
  return technologies.filter(Boolean).join(", ");
};

function TechnologyPicker({ initialValue = "", onSave, onCancel }) {
  const { t } = useTranslation();
  // Pobierz wszystkie dostępne nazwy technologii (memoized, bo TECHNOLOGIES jest stałą)
  const allAvailableTechNames = useMemo(
    () =>
      Object.values(TECHNOLOGIES)
        .flatMap((cat) => cat.technologies)
        .map((t) => t.name.toLowerCase()),
    []
  );
  
  // Funkcja do inicjalizacji stanu z wartości
  const initializeState = useCallback(
    (value) => {
      const initialTechs = parseTechnologies(value);
      const availableTechs = initialTechs.filter((tech) =>
        allAvailableTechNames.includes(tech.toLowerCase())
      );
      const otherTechs = initialTechs.filter(
        (tech) => !allAvailableTechNames.includes(tech.toLowerCase())
      );
      return {
        selectedTechs: new Set(availableTechs),
        otherEnabled: otherTechs.length > 0,
        otherValue: otherTechs.join(", "),
      };
    },
    [allAvailableTechNames]
  );
  
  const [selectedTechs, setSelectedTechs] = useState(() => 
    initializeState(initialValue).selectedTechs
  );
  const [otherEnabled, setOtherEnabled] = useState(() => 
    initializeState(initialValue).otherEnabled
  );
  const [otherValue, setOtherValue] = useState(() => 
    initializeState(initialValue).otherValue
  );

  // Synchronizuj stan gdy initialValue się zmienia
  useEffect(() => {
    const newState = initializeState(initialValue);
    setSelectedTechs(newState.selectedTechs);
    setOtherEnabled(newState.otherEnabled);
    setOtherValue(newState.otherValue);
  }, [initialValue, initializeState]);

  const toggleTechnology = (techId, techName) => {
    setSelectedTechs((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(techName)) {
        newSet.delete(techName);
      } else {
        newSet.add(techName);
      }
      return newSet;
    });
  };

  const handleSave = () => {
    const allSelected = Array.from(selectedTechs);
    if (otherEnabled && otherValue.trim()) {
      const otherTechs = otherValue
        .split(",")
        .map((t) => t.trim())
        .filter((t) => t.length > 0);
      allSelected.push(...otherTechs);
    }
    onSave(formatTechnologies(allSelected));
  };

  const handleOtherToggle = (enabled) => {
    setOtherEnabled(enabled);
    if (!enabled) {
      setOtherValue("");
    }
  };

  // Render ikony (placeholder - łatwe do rozszerzenia)
  const renderIcon = (tech) => {
    if (tech.icon) {
      return tech.icon;
    }
    // Placeholder dla przyszłych ikon
    return null;
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">
          {t("titlePages.sections.technologies.title")}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {t("titlePages.sections.technologies.instruction")}
        </p>
      </div>

      <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-2">
        {Object.entries(TECHNOLOGIES).map(([categoryKey, category]) => (
          <div key={categoryKey} className="space-y-3">
            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
              {category.label}
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {category.technologies.map((tech) => {
                const isSelected = selectedTechs.has(tech.name);
                return (
                  <label
                    key={tech.id}
                    className={`flex items-center space-x-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                      isSelected
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-400"
                        : "border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 bg-white dark:bg-gray-700"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleTechnology(tech.id, tech.name)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 dark:bg-gray-600 dark:border-gray-500"
                    />
                    <div className="flex items-center space-x-2 flex-1">
                      {renderIcon(tech) && (
                        <span className="text-gray-600 dark:text-gray-400">
                          {renderIcon(tech)}
                        </span>
                      )}
                      <span
                        className={`text-sm font-medium ${
                          isSelected
                            ? "text-blue-700 dark:text-blue-300"
                            : "text-gray-700 dark:text-gray-300"
                        }`}
                      >
                        {tech.name}
                      </span>
                    </div>
                    {isSelected && (
                      <Check
                        size={16}
                        className="text-blue-600 dark:text-blue-400"
                      />
                    )}
                  </label>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Opcja "Inne" */}
      <div className="space-y-3 border-t border-gray-200 dark:border-gray-700 pt-4">
        <label className="flex items-center space-x-3 p-3 rounded-lg border-2 cursor-pointer transition-all border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 bg-white dark:bg-gray-700">
          <input
            type="checkbox"
            checked={otherEnabled}
            onChange={(e) => handleOtherToggle(e.target.checked)}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 dark:bg-gray-600 dark:border-gray-500"
          />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {t("titlePages.sections.technologies.other")}
          </span>
        </label>

        {otherEnabled && (
          <div>
            <input
              type="text"
              value={otherValue}
              onChange={(e) => setOtherValue(e.target.value)}
              placeholder={t("titlePages.sections.technologies.otherPlaceholder")}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:text-gray-100 dark:placeholder-gray-400"
            />
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Możesz wpisać wiele technologii, oddzielając je przecinkami
            </p>
          </div>
        )}
      </div>

      {/* Podsumowanie wybranych */}
      {selectedTechs.size > 0 && (
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 border border-blue-200 dark:border-blue-800">
          <p className="text-xs font-semibold text-blue-800 dark:text-blue-300 mb-2">
            Wybrane technologie ({selectedTechs.size}
            {otherEnabled && otherValue.trim() ? " + inne" : ""}):
          </p>
          <div className="flex flex-wrap gap-2">
            {Array.from(selectedTechs).map((tech) => (
              <span
                key={tech}
                className="px-2 py-1 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 rounded text-xs font-medium"
              >
                {tech}
              </span>
            ))}
            {otherEnabled && otherValue.trim() && (
              <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 rounded text-xs font-medium">
                {otherValue.split(",").length} inne
              </span>
            )}
          </div>
        </div>
      )}

      {/* Przyciski akcji */}
      <div className="flex space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={handleSave}
          className="flex-1 px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-colors"
        >
          {t("titlePages.sections.technologies.save")}
        </button>
        <button
          onClick={onCancel}
          className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 font-semibold rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-colors"
        >
          {t("common.cancel")}
        </button>
      </div>
    </div>
  );
}

export default TechnologyPicker;

