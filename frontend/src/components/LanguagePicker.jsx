import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { X, Plus, Trash2 } from "lucide-react";

// Popularne języki - klucze dla tłumaczeń
const POPULAR_LANGUAGE_KEYS = [
  "polish",
  "english",
  "german",
  "french",
  "spanish",
  "italian",
  "russian",
  "chinese",
  "japanese",
  "korean",
  "portuguese",
  "dutch",
  "swedish",
  "norwegian",
  "danish",
  "czech",
  "slovak",
  "ukrainian",
  "hungarian",
  "romanian",
];

// Mapowanie starych nazw na klucze (dla kompatybilności z istniejącymi danymi)
const LANGUAGE_NAME_TO_KEY = {
  "Polski": "polish",
  "Angielski": "english",
  "Niemiecki": "german",
  "Francuski": "french",
  "Hiszpański": "spanish",
  "Włoski": "italian",
  "Rosyjski": "russian",
  "Chiński": "chinese",
  "Japoński": "japanese",
  "Koreański": "korean",
  "Portugalski": "portuguese",
  "Holenderski": "dutch",
  "Szwedzki": "swedish",
  "Norweski": "norwegian",
  "Duński": "danish",
  "Czeski": "czech",
  "Słowacki": "slovak",
  "Ukraiński": "ukrainian",
  "Węgierski": "hungarian",
  "Rumuński": "romanian",
};

// Poziomy znajomości języka
const LANGUAGE_LEVELS = [
  { value: "ojczysty", label: "Ojczysty" },
  { value: "C2", label: "C2 - Biegły" },
  { value: "C1", label: "C1 - Zaawansowany" },
  { value: "B2", label: "B2 - Średnio zaawansowany wyższy" },
  { value: "B1", label: "B1 - Średnio zaawansowany" },
  { value: "A2", label: "A2 - Podstawowy wyższy" },
  { value: "A1", label: "A1 - Podstawowy" },
];

function LanguagePicker({ initialValue = [], onSave, onCancel }) {
  const { t } = useTranslation();
  const [languages, setLanguages] = useState(() => {
    if (Array.isArray(initialValue) && initialValue.length > 0) {
      // Konwersja starych nazw na klucze dla kompatybilności
      return initialValue.map(lang => {
        if (lang.name && LANGUAGE_NAME_TO_KEY[lang.name]) {
          return { ...lang, name: LANGUAGE_NAME_TO_KEY[lang.name] };
        }
        return lang;
      });
    }
    return [];
  });

  const [newLanguage, setNewLanguage] = useState("");
  const [newLevel, setNewLevel] = useState("B2");
  const [showAddForm, setShowAddForm] = useState(false);

  const addLanguage = () => {
    if (!newLanguage.trim()) return;

    // Konwertuj wpisaną nazwę na klucz
    let languageKey;
    
    // 1. Sprawdź czy to tłumaczona nazwa z popularnych języków
    const foundKey = POPULAR_LANGUAGE_KEYS.find(key => 
      t(`titlePages.languageNames.${key}`).toLowerCase() === newLanguage.trim().toLowerCase()
    );
    
    if (foundKey) {
      languageKey = foundKey;
    } 
    // 2. Sprawdź czy to stara polska nazwa
    else if (LANGUAGE_NAME_TO_KEY[newLanguage.trim()]) {
      languageKey = LANGUAGE_NAME_TO_KEY[newLanguage.trim()];
    }
    // 3. W przeciwnym razie użyj wpisanej wartości jako klucz (lowercase)
    else {
      languageKey = newLanguage.trim().toLowerCase();
    }

    const languageObj = {
      id: Date.now(),
      name: languageKey,
      level: newLevel,
    };

    setLanguages([...languages, languageObj]);
    setNewLanguage("");
    setNewLevel("B2");
    setShowAddForm(false);
  };

  const removeLanguage = (id) => {
    setLanguages(languages.filter((lang) => lang.id !== id));
  };

  const handleSave = () => {
    onSave(languages);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">
          {t("titlePages.sections.languages.title")}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {t("titlePages.sections.languages.instruction")}
        </p>
      </div>

      {/* Lista dodanych języków */}
      {languages.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            {t("titlePages.sections.languages.title")} ({languages.length})
          </h4>
          <div className="space-y-2">
            {languages.map((lang) => (
              <div
                key={lang.id}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600"
              >
                <div className="flex items-center space-x-3">
                  <span className="font-medium text-gray-800 dark:text-gray-200">
                    {t(`titlePages.languageNames.${lang.name}`, { defaultValue: lang.name })}
                  </span>
                  <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 rounded text-sm font-medium">
                    {lang.level === "ojczysty" ? t("titlePages.sections.languages.native") : (LANGUAGE_LEVELS.find((l) => l.value === lang.level)?.label || lang.level)}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => removeLanguage(lang.id)}
                  className="p-1 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Formularz dodawania nowego języka */}
      {showAddForm ? (
        <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t("titlePages.sections.languages.languageName")}
            </label>
            <div className="flex space-x-2">
              <input
                type="text"
                value={newLanguage}
                onChange={(e) => setNewLanguage(e.target.value)}
                placeholder={t("titlePages.sections.languages.languageName")}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:text-gray-100 dark:placeholder-gray-400"
                list="languages-list"
              />
              <datalist id="languages-list">
                {POPULAR_LANGUAGE_KEYS.map((langKey) => (
                  <option key={langKey} value={t(`titlePages.languageNames.${langKey}`)} />
                ))}
              </datalist>
              <button
                type="button"
                onClick={addLanguage}
                disabled={!newLanguage.trim()}
                className="px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {t("common.add")}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowAddForm(false);
                  setNewLanguage("");
                }}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 font-semibold rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t("titlePages.sections.languages.level")}
            </label>
            <select
              value={newLevel}
              onChange={(e) => setNewLevel(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:text-gray-100"
            >
                    {LANGUAGE_LEVELS.map((level) => (
                      <option key={level.value} value={level.value}>
                        {level.value === "ojczysty" ? t("titlePages.sections.languages.native") : level.label}
                      </option>
                    ))}
            </select>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setShowAddForm(true)}
          className="w-full flex items-center justify-center space-x-2 px-4 py-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-blue-500 dark:hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors text-gray-700 dark:text-gray-300"
        >
          <Plus size={20} />
          <span>{t("titlePages.sections.languages.add")}</span>
        </button>
      )}

      {/* Szybkie dodawanie popularnych języków */}
      {languages.length === 0 && (
        <div>
          <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            {t("titlePages.sections.languages.popular")}
          </h4>
          <div className="flex flex-wrap gap-2">
            {POPULAR_LANGUAGE_KEYS.slice(0, 8).map((langKey) => {
              const translatedName = t(`titlePages.languageNames.${langKey}`);
              return (
                <button
                  key={langKey}
                  type="button"
                  onClick={() => {
                    // Ustawiamy przetłumaczoną nazwę w input (użytkownik widzi nazwę w swoim języku)
                    setNewLanguage(translatedName);
                    setShowAddForm(true);
                  }}
                  className="px-3 py-1.5 text-sm bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 transition-colors"
                >
                  {translatedName}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Przyciski akcji */}
      <div className="flex space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={handleSave}
          className="flex-1 px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-colors"
        >
          {t("common.save")}
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

export default LanguagePicker;

