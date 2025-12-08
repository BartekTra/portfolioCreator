import React from "react";
import { ExternalLink, Github } from "lucide-react";
import { TEMPLATES } from "../templates/templates";

const getTemplateByKey = (key) => TEMPLATES.find((template) => template.id === key);

// Mapowanie typów sekcji na ich nazwy (zgodne z SECTION_TYPES z DynamicProjectForm)
const SECTION_TYPE_LABELS = {
  title: "Tytuł",
  description: "Opis",
  technologies: "Technologie",
  image: "Zdjęcie",
  github_url: "Link GitHub",
  live_url: "Link Live",
};

const getSectionLabel = (sectionType) => {
  return SECTION_TYPE_LABELS[sectionType] || sectionType;
};

const getSectionImages = (project, sectionId) => {
  if (!project.images || project.images.length === 0) return [];
  return project.images.filter((image) => image.section_id === sectionId);
};

const renderSectionContent = (project, section, onImageClick) => {
  switch (section.type) {
    case "title":
      return (
        <h3 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">{section.value}</h3>
      );

    case "description":
      return (
        <p className="text-gray-600 dark:text-gray-300 whitespace-pre-wrap">{section.value}</p>
      );

    case "technologies": {
      const technologies = Array.isArray(section.value)
        ? section.value
        : section.value?.split(",").map((tech) => tech.trim());
      return (
        <div className="flex flex-wrap gap-2">
          {technologies?.map((tech) => (
            <span
              key={tech}
              className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700 dark:bg-blue-900/40 dark:text-blue-200"
            >
              {tech}
            </span>
          ))}
        </div>
      );
    }

    case "image": {
      const images = getSectionImages(project, section.id);
      return images.length > 0 ? (
        <div className="flex flex-col gap-3 h-full w-full">
          {images.map((image) => (
            <div 
              key={image.url} 
              className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700 cursor-pointer hover:opacity-90 transition-opacity w-full flex-1 min-h-[150px] flex items-center justify-center bg-gray-50 dark:bg-gray-800"
              onClick={() => onImageClick && onImageClick(image.url)}
            >
              <img
                src={image.url}
                alt={`${section.type || "section"} image`}
                className="w-full h-full object-contain"
              />
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-500 dark:text-gray-400">Brak zdjęć</p>
      );
    }

    case "github_url":
      return (
        <a
          href={section.value}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-blue-600 hover:underline dark:text-blue-300"
        >
          <Github size={18} />
          Zobacz kod na GitHub
        </a>
      );

    case "live_url":
      return (
        <a
          href={section.value}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-blue-600 hover:underline dark:text-blue-300"
        >
          <ExternalLink size={18} />
          Zobacz wersję live
        </a>
      );

    default:
      return <p className="text-gray-500 dark:text-gray-400">Brak danych dla tej sekcji</p>;
  }
};

function ProjectTemplateRenderer({ project, onImageClick }) {
  const templateKey = project.template_key || project.data?.template_key;
  const template = getTemplateByKey(templateKey) || TEMPLATES[0];
  const sections = (project.data?.sections || []).sort(
    (a, b) => (a.order ?? 0) - (b.order ?? 0),
  );

  const sectionBySlot = sections.reduce((acc, section) => {
    if (section.slot_id) {
      acc[section.slot_id] = section;
    }
    return acc;
  }, {});

  const orphanSections = sections.filter((section) => !section.slot_id);

  return (
    <div className="space-y-6">
      <div className={`${template.layout.container} gap-4`}>
        {template.slots.map((slot) => {
          const section = sectionBySlot[slot.id];
          return (
            <div
              key={slot.id}
              className={`rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900 flex flex-col ${slot.className}`}
            >
              {section && (
                <div className="mb-4 flex-shrink-0">
                  <p className="text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                    {getSectionLabel(section.type)}
                  </p>
                </div>
              )}
              <div className={`flex-1 ${section ? "" : "mt-4"}`}>
                {section ? (
                  renderSectionContent(project, section, onImageClick)
                ) : (
                  <div className="rounded-lg border border-dashed border-gray-300 p-4 text-center text-sm text-gray-400 dark:border-gray-700 dark:text-gray-500">
                    Slot pusty
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {orphanSections.length > 0 && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-500/40 dark:bg-amber-500/10">
          <p className="mb-3 text-sm font-semibold text-amber-700 dark:text-amber-200">
            Sekcje nieprzypisane do template'u
          </p>
          <div className="space-y-3">
            {orphanSections.map((section) => (
              <div key={section.id} className="rounded-lg border border-amber-200 bg-white/80 p-3 dark:border-amber-500/30 dark:bg-transparent">
                {renderSectionContent(project, section, onImageClick)}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default ProjectTemplateRenderer;

