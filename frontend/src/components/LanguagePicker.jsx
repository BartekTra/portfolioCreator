import React, { useState } from "react";
import { X, Plus, Trash2 } from "lucide-react";

// Popularne języki
const POPULAR_LANGUAGES = [
  "Polski",
  "Angielski",
  "Niemiecki",
  "Francuski",
  "Hiszpański",
  "Włoski",
  "Rosyjski",
  "Chiński",
  "Japoński",
  "Koreański",
  "Portugalski",
  "Holenderski",
  "Szwedzki",
  "Norweski",
  "Duński",
  "Czeski",
  "Słowacki",
  "Ukraiński",
  "Węgierski",
  "Rumuński",
];

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
  const [languages, setLanguages] = useState(() => {
    if (Array.isArray(initialValue) && initialValue.length > 0) {
      return initialValue;
    }
    return [];
  });

  const [newLanguage, setNewLanguage] = useState("");
  const [newLevel, setNewLevel] = useState("B2");
  const [showAddForm, setShowAddForm] = useState(false);

  const addLanguage = () => {
    if (!newLanguage.trim()) return;

    const languageObj = {
      id: Date.now(),
      name: newLanguage.trim(),
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
          Języki
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Dodaj języki, które znasz, wraz z poziomem znajomości.
        </p>
      </div>

      {/* Lista dodanych języków */}
      {languages.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            Dodane języki ({languages.length})
          </h4>
          <div className="space-y-2">
            {languages.map((lang) => (
              <div
                key={lang.id}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600"
              >
                <div className="flex items-center space-x-3">
                  <span className="font-medium text-gray-800 dark:text-gray-200">
                    {lang.name}
                  </span>
                  <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 rounded text-sm font-medium">
                    {LANGUAGE_LEVELS.find((l) => l.value === lang.level)?.label || lang.level}
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
              Nazwa języka
            </label>
            <div className="flex space-x-2">
              <input
                type="text"
                value={newLanguage}
                onChange={(e) => setNewLanguage(e.target.value)}
                placeholder="np. Angielski"
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:text-gray-100 dark:placeholder-gray-400"
                list="languages-list"
              />
              <datalist id="languages-list">
                {POPULAR_LANGUAGES.map((lang) => (
                  <option key={lang} value={lang} />
                ))}
              </datalist>
              <button
                type="button"
                onClick={addLanguage}
                disabled={!newLanguage.trim()}
                className="px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Dodaj
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
              Poziom znajomości
            </label>
            <select
              value={newLevel}
              onChange={(e) => setNewLevel(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:text-gray-100"
            >
              {LANGUAGE_LEVELS.map((level) => (
                <option key={level.value} value={level.value}>
                  {level.label}
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
          <span>Dodaj język</span>
        </button>
      )}

      {/* Szybkie dodawanie popularnych języków */}
      {languages.length === 0 && (
        <div>
          <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Popularne języki
          </h4>
          <div className="flex flex-wrap gap-2">
            {POPULAR_LANGUAGES.slice(0, 8).map((lang) => (
              <button
                key={lang}
                type="button"
                onClick={() => {
                  setNewLanguage(lang);
                  setShowAddForm(true);
                }}
                className="px-3 py-1.5 text-sm bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 transition-colors"
              >
                {lang}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Przyciski akcji */}
      <div className="flex space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={handleSave}
          className="flex-1 px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-colors"
        >
          Zapisz języki
        </button>
        <button
          onClick={onCancel}
          className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 font-semibold rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-colors"
        >
          Anuluj
        </button>
      </div>
    </div>
  );
}

export default LanguagePicker;

