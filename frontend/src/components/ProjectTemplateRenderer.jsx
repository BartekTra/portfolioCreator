import React from "react";
import { useTranslation } from "react-i18next";
import { ExternalLink, Github } from "lucide-react";
import { TEMPLATES } from "../templates/templates";

const getTemplateByKey = (key) =>
  TEMPLATES.find((template) => template.id === key);

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
  return project.images
    .filter((image) => image.section_id === sectionId)
    .sort((a, b) => (a.file_index || 0) - (b.file_index || 0));
};

// Oblicz sztywną wysokość sekcji na podstawie układu grid
const getHeightForGrid = (containerClass, slotsCount) => {
  if (!containerClass.includes("grid")) return null;

  // Wyciągnij liczbę kolumn z klasy (np. "grid-cols-3" -> 3)
  const colsMatch = containerClass.match(/grid-cols-(\d+)/);
  if (!colsMatch) return null;

  const cols = parseInt(colsMatch[1], 10);
  // Oblicz liczbę wierszy na podstawie liczby slotów i kolumn
  const rows = Math.ceil(slotsCount / cols);
  // Każda sekcja powinna mieć wysokość równą 100% / liczba_wierszy
  const heightPercent = 100 / rows;
  return `${heightPercent}%`;
};

const renderSectionContent = (
  project,
  section,
  onImageClick,
  isMosaic = false,
  t
) => {
  switch (section.type) {
    case "title":
      return (
        <div className="h-full overflow-y-auto no-scrollbar">
          <p className="text-gray-600 dark:text-gray-300 whitespace-pre-wrap break-words no-scrollbar text-lg font-bold">
            {section.value}
          </p>
        </div>
      );

    case "description":
      return (
        <div className="h-full overflow-y-auto no-scrollbar">
          <p className="text-gray-600 dark:text-gray-300 whitespace-pre-wrap break-words no-scrollbar">
            {section.value}
          </p>
        </div>
      );

    case "technologies": {
      const technologies = Array.isArray(section.value)
        ? section.value
        : section.value?.split(",").map((tech) => tech.trim());
      return (
        <div className="h-full flex items-center flex-wrap gap-2 overflow-y-auto">
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

      // ZMIANA 1: Usuwamy zmienną maxHeightClass, która ograniczała mozaiki do 400px
      // Dzięki temu zdjęcie wypełni dostępną przestrzeń siatki (Grid).

      return images.length > 0 ? (
        <div
          className={`flex flex-col gap-3 w-full h-full ${
            isMosaic ? "" : "overflow-y-auto"
          }`}
        >
          {images.map((image) => {
            const hasDescription =
              image.description && image.description.trim();
            return (
              <div
                key={image.url}
                // ZMIANA 2: Wymuszamy h-full (zamiast isMosaic ? 'h-auto' : 'h-full')
                // i usuwamy 'max-h-[400px]'
                className={`w-full h-full flex flex-col min-h-0`}
              >
                <div
                  // ZMIANA 3: Uproszczona logika klas kontenera zdjęcia.
                  // Usuwamy sztywne 'max-h-[350px]' dla mozaik.
                  className={`overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700 cursor-pointer hover:opacity-90 transition-opacity w-full flex items-center justify-center bg-gray-50 dark:bg-gray-800 ${
                    hasDescription ? "flex-1 min-h-0" : "h-full"
                  }`}
                  onClick={() => onImageClick && onImageClick(image.url)}
                >
                  <img
                    src={image.url}
                    alt={`${section.type || "section"} image`}
                    // ZMIANA 4: Usunięto styl inline 'maxHeight', który nadpisywał CSS.
                    // Opcjonalnie: Zmień 'object-contain' na 'object-cover',
                    // jeśli chcesz, aby zdjęcie wypełniło cały obszar bez białych pasków (przycinając krawędzie).
                    className="max-w-full max-h-full w-auto h-auto object-cover"
                  />
                </div>
                {hasDescription && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 text-center py-1 flex-shrink-0 whitespace-normal break-words">
                    {image.description}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-sm text-gray-500 dark:text-gray-400">{t("sections.noImages")}</p>
      );
    }

    case "github_url":
      return (
        <div className="h-full flex items-center">
          <a
            href={section.value}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-blue-600 hover:underline dark:text-blue-300"
          >
            <Github size={18} />
            {t("sections.githubUrl")}
          </a>
        </div>
      );

    case "live_url":
      return (
        <div className="h-full flex items-center">
          <a
            href={section.value}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-blue-600 hover:underline dark:text-blue-300"
          >
            <ExternalLink size={18} />
            {t("sections.liveUrl")}
          </a>
        </div>
      );

    default:
      return (
        <p className="text-gray-500 dark:text-gray-400">
          {t("sections.noData")}
        </p>
      );
  }
};

function ProjectTemplateRenderer({ project, onImageClick }) {
  const { t } = useTranslation();
  const templateKey = project.template_key || project.data?.template_key;
  const template = getTemplateByKey(templateKey) || TEMPLATES[0];
  const sections = (project.data?.sections || []).sort(
    (a, b) => (a.order ?? 0) - (b.order ?? 0)
  );

  // Sprawdź czy template używa grid (mozaika) czy flex (pionowe/poziome)
  const isGridLayout = template.layout.container.includes("grid");
  const isMosaic = template.category === "mozaika";
  const gridHeight = getHeightForGrid(
    template.layout.container,
    template.slots.length
  );

  const sectionBySlot = sections.reduce((acc, section) => {
    if (section.slot_id) {
      acc[section.slot_id] = section;
    }
    return acc;
  }, {});

  const orphanSections = sections.filter((section) => !section.slot_id);

  // Dla grid layouts obliczamy wysokość wiersza
  // Musimy uwzględnić gap w obliczeniach - wyciągnij gap z klasy
  const gapMatch = template.layout.container.match(/gap-(\d+)/);
  const gapValue = gapMatch ? parseInt(gapMatch[1], 10) * 0.25 : 0; // gap-4 = 1rem = 16px, gap-1 = 0.25rem = 4px
  const gapPx = gapValue * 16; // konwersja rem na px

  // Padding sekcji (p-2 = 0.5rem = 8px) i border (1px każdy = 2px total)
  const sectionPadding = 8 * 2; // padding top + bottom
  const sectionBorder = 2; // border top + bottom

  // Oblicz wysokość wiersza uwzględniając gap, padding i border (tylko dla nie-mozaik)
  // Mozaiki mogą być scrollowalne, więc nie ustawiamy sztywnych wysokości
  let gridContainerStyle = {};
  if (gridHeight && isGridLayout && !isMosaic) {
    const cols = parseInt(
      template.layout.container.match(/grid-cols-(\d+)/)?.[1] || "1",
      10
    );
    const rows = Math.ceil(template.slots.length / cols);
    // Odejmij gap, padding i border od całkowitej wysokości przed podziałem
    const totalGap = (rows - 1) * gapPx;
    const totalPadding = rows * sectionPadding;
    const totalBorder = rows * sectionBorder;
    const heightWithGap = `calc((100vh) / ${rows})`;
    gridContainerStyle = { gridAutoRows: heightWithGap };
  }

  return (
    <div className={`h-full w-full flex flex-col overflow-hidden `}>
      {/* ZMIANA: Usunięto warunek isMosaic ? 'overflow-y-auto' : 'overflow-hidden'. 
        Teraz zawsze jest 'overflow-hidden', żeby zmieścić się na ekranie. */}
      <div
        className={`${template.layout.container} flex-1 h-full no-scrollbar`}
        // ZMIANA: Usunięto warunek isMosaic ? 'h-auto'. Teraz zawsze 'flex-1 h-full'.
        // style={gridContainerStyle} <- To można zostawić lub usunąć,
        // bo teraz sterujemy wysokością przez grid-rows-2 w klasie CSS template'u.
        style={isMosaic ? {} : gridContainerStyle}
      >
        {template.slots.map((slot) => {
          const section = sectionBySlot[slot.id];
          return (
            <div
              key={slot.id}
              // ZMIANA: Zawsze 'h-full', usunięto warunek isMosaic
              className={`rounded-2xl border border-gray-200 bg-white p-2 dark:border-gray-700 dark:bg-gray-900 flex flex-col h-full box-border min-w-0 ${slot.className} `}
            >
              <div
                // ZMIANA: Zawsze 'h-full overflow-hidden'
                // Dzięki temu jeśli tekst jest długi, scroll pojawi się WEWNĄTRZ kafelka, a nie rozepcha ekranu.
                className={`h-full w-full overflow-hidden ${
                  section ? "" : "mt-4"
                } `}
              >
                {section ? (
                  // ZMIANA TUTAJ:
                  // Było: renderSectionContent(project, section, onImageClick, isMosaic)
                  // Jest: renderSectionContent(project, section, onImageClick, false)

                  renderSectionContent(project, section, onImageClick, false, t)
                ) : (
                  <div className="rounded-lg border border-dashed ... ">
                    {t("sections.emptySlot")}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {orphanSections.length > 0 && (
        <div className="flex-shrink-0 mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-500/40 dark:bg-amber-500/10 no-scrollbar">
          <p className="mb-3 text-sm font-semibold text-amber-700 dark:text-amber-200">
            {t("sections.orphanSections")}
          </p>
          <div className="space-y-3">
            {orphanSections.map((section) => (
              <div
                key={section.id}
                className="rounded-lg border border-amber-200 bg-white/80 p-3 dark:border-amber-500/30 dark:bg-transparent "
              >
                {renderSectionContent(project, section, onImageClick, false, t)}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default ProjectTemplateRenderer;
