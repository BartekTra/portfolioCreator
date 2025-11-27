import React from "react";
import { Check } from "lucide-react";
import { TEMPLATES } from "../templates/templates";

function TemplatePicker({ selectedTemplateId, onSelect }) {
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

      <div className="grid gap-6 md:grid-cols-2 auto-rows-fr">
        {TEMPLATES.map((template) => {
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

