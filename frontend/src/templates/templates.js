export const TEMPLATES = [
  {
    id: "templateA",
    name: "Template A",
    description: "Układ 4-polowy symetryczny",
    layout: {
      container: "grid grid-cols-2 gap-4",
    },
    slots: [
      {
        id: "templateA-slot-1",
        label: "Lewy górny",
        helper: "Idealny na tytuł lub opis intro",
        className: "min-h-[170px]",
      },
      {
        id: "templateA-slot-2",
        label: "Prawy górny",
        helper: "Wyróżnij technologie lub link",
        className: "min-h-[170px]",
      },
      {
        id: "templateA-slot-3",
        label: "Lewy dolny",
        helper: "Dodaj opis lub galerię",
        className: "min-h-[170px]",
      },
      {
        id: "templateA-slot-4",
        label: "Prawy dolny",
        helper: "Sekcja dodatkowa",
        className: "min-h-[170px]",
      },
    ],
  },
  {
    id: "templateB",
    name: "Template B",
    description: "Duża sekcja + dwa mniejsze bloki",
    layout: {
      container: "grid grid-cols-2 gap-4 auto-rows-fr",
    },
    slots: [
      {
        id: "templateB-slot-1",
        label: "Dominujący blok",
        helper: "Najważniejsza sekcja projektu",
        className: "col-span-2 min-h-[220px]",
      },
      {
        id: "templateB-slot-2",
        label: "Blok dolny lewy",
        helper: "Sekcja pomocnicza",
        className: "min-h-[160px]",
      },
      {
        id: "templateB-slot-3",
        label: "Blok dolny prawy",
        helper: "Uzupełniająca treść",
        className: "min-h-[160px]",
      },
    ],
  },
  {
    id: "templateC",
    name: "Template C",
    description: "Trzy sekcje w pionie",
    layout: {
      container: "flex flex-col gap-4",
    },
    slots: [
      {
        id: "templateC-slot-1",
        label: "Sekcja górna",
        helper: "Np. tytuł i krótki opis",
        className: "min-h-[140px]",
      },
      {
        id: "templateC-slot-2",
        label: "Sekcja środkowa",
        helper: "Rozwinięcie treści",
        className: "min-h-[140px]",
      },
      {
        id: "templateC-slot-3",
        label: "Sekcja dolna",
        helper: "Linki lub multimedia",
        className: "min-h-[140px]",
      },
    ],
  },
  {
    id: "templateD",
    name: "Template D",
    description: "Asymetryczna mozaika 1 + 2",
    layout: {
      container: "grid grid-cols-3 gap-4 auto-rows-fr",
    },
    slots: [
      {
        id: "templateD-slot-1",
        label: "Duży blok lewy",
        helper: "Najważniejszy element",
        className: "col-span-2 row-span-2 min-h-[260px]",
      },
      {
        id: "templateD-slot-2",
        label: "Prawy górny",
        helper: "Sekcja wspierająca",
        className: "col-span-1 min-h-[120px]",
      },
      {
        id: "templateD-slot-3",
        label: "Prawy dolny",
        helper: "Dodatkowe informacje",
        className: "col-span-1 min-h-[120px]",
      },
    ],
  },
];

