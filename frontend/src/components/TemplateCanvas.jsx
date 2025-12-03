import React from "react";
import { Plus } from "lucide-react";

function TemplateCanvas({ template, sections, onSlotClick, renderSection, onClearSlot }) {
  if (!template) {
    return null;
  }

  const sectionBySlot = sections.reduce((acc, section) => {
    acc[section.slotId] = section;
    return acc;
  }, {});

  return (
    <div className="space-y-4">
      <p className="text-gray-600 dark:text-gray-300">
        Kliknij pusty slot, aby dodać sekcję. Aby zmienić sekcję, najpierw ją usuń.
      </p>
      <div className={`${template.layout.container} rounded-2xl bg-gray-50 p-4 dark:bg-gray-900`}>
        {template.slots.map((slot) => {
          const section = sectionBySlot[slot.id];
          const hasSection = Boolean(section);
          return (
            <div
              key={slot.id}
              className={`relative flex h-full w-full flex-col rounded-xl border-2 p-3 text-left transition-all ${
                hasSection
                  ? "border-transparent bg-white shadow-sm dark:bg-gray-800"
                  : "border-dashed border-gray-300 hover:border-blue-400 dark:border-gray-700 dark:hover:border-blue-400"
              } ${slot.className}`}
            >
              <div className="mb-2 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                    {slot.label}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{slot.helper}</p>
                </div>
                {hasSection && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onClearSlot(slot.id);
                    }}
                    className="text-xs font-medium text-red-500 hover:text-red-600"
                  >
                    Usuń
                  </button>
                )}
              </div>

              <div className="flex-1">
                {hasSection ? (
                  <div onClick={(e) => e.stopPropagation()}>
                    {renderSection(section)}
                  </div>
                ) : (
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={() => onSlotClick(slot.id)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        onSlotClick(slot.id);
                      }
                    }}
                    className="flex h-full w-full flex-col items-center justify-center rounded-lg border border-dashed border-gray-200 py-6 text-center text-gray-500 transition-colors hover:border-blue-400 hover:bg-blue-50/50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-blue-900/20 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
                  >
                    <Plus size={20} className="mb-1" />
                    <span>Dodaj sekcję</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default TemplateCanvas;

