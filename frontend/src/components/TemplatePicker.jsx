import React, { useState } from "react";
import { Check } from "lucide-react";
import { TEMPLATES, TEMPLATE_CATEGORIES } from "../templates/templates";

function TemplatePicker({ selectedTemplateId, onSelect }) {
  const [activeCategory, setActiveCategory] = useState(Object.keys(TEMPLATE_CATEGORIES)[0]);

  const templatesInCategory = TEMPLATES.filter(
    (template) => template.category === activeCategory
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
          Wybierz template projektu
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          Każdy template ma unikalny układ slotów na sekcje. Zmiana template'u
          wyczyści aktualnie dodane sekcje.
        </p>
      </div>

      {/* Zakładki kategorii */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="flex space-x-1 overflow-x-auto" aria-label="Kategorie template'ów">
          {Object.entries(TEMPLATE_CATEGORIES).map(([key, category]) => {
            const categoryTemplates = TEMPLATES.filter((t) => t.category === key);
            const isActive = activeCategory === key;
            return (
              <button
                key={key}
                onClick={() => setActiveCategory(key)}
                className={`
                  px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors
                  ${
                    isActive
                      ? "border-blue-500 text-blue-600 dark:text-blue-400"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
                  }
                `}
              >
                {category.label}
                <span className="ml-2 text-xs bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded-full">
                  {categoryTemplates.length}
                </span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Opis kategorii */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <p className="text-sm text-blue-800 dark:text-blue-300">
          <span className="font-semibold">{TEMPLATE_CATEGORIES[activeCategory].label}:</span>{" "}
          {TEMPLATE_CATEGORIES[activeCategory].description}
        </p>
      </div>

      {/* Template'y w wybranej kategorii */}
      <div className="grid gap-6 md:grid-cols-2 auto-rows-fr">
        {templatesInCategory.map((template) => {
          const isActive = selectedTemplateId === template.id;
          return (
            <button
              key={template.id}
              type="button"
              onClick={() => onSelect(template.id)}
              className={`flex h-full w-full flex-col rounded-xl border-2 p-5 text-left transition-all ${
                isActive
                  ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                  : "border-gray-200 dark:border-gray-600 hover:border-blue-400"
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                    {template.name}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {template.description}
                  </p>
                </div>
                {isActive && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-blue-600 px-3 py-1 text-sm font-medium text-white">
                    <Check size={16} />
                    Wybrano
                  </span>
                )}
              </div>

              <div className="mt-4 rounded-lg bg-white p-4 shadow-inner dark:bg-gray-800">
                <div className={`w-full min-h-[170px] ${template.layout.container}`}>
                  {template.slots.map((slot) => (
                    <div
                      key={slot.id}
                      className={`rounded-md border-2 border-dashed border-gray-300 bg-gray-50 dark:border-gray-600 dark:bg-gray-700 ${slot.className}`}
                    />
                  ))}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default TemplatePicker;

