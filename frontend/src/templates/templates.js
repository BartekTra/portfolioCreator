export const TEMPLATE_CATEGORIES = {
  symetryczne: {
    label: "Symetryczne",
    description: "Zbalansowane układy z równymi sekcjami",
  },
  pionowe: {
    label: "Pionowe",
    description: "Układy wertykalne, sekcje jedna pod drugą",
  },
  poziome: {
    label: "Poziome",
    description: "Układy horyzontalne, sekcje obok siebie",
  },
  mozaika: {
    label: "Mozaika",
    description: "Asymetryczne i dynamiczne układy",
  },
};

export const TEMPLATES = [
  // KATEGORIA: SYMETRYCZNE
  {
    id: "templateA",
    name: "Template A",
    category: "symetryczne",
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
    id: "templateE",
    name: "Template E",
    category: "symetryczne",
    description: "Układ 6-polowy symetryczny",
    layout: {
      container: "grid grid-cols-3 gap-4",
    },
    slots: [
      {
        id: "templateE-slot-1",
        label: "Górny lewy",
        helper: "Sekcja wprowadzająca",
        className: "min-h-[140px]",
      },
      {
        id: "templateE-slot-2",
        label: "Górny środkowy",
        helper: "Technologie lub linki",
        className: "min-h-[140px]",
      },
      {
        id: "templateE-slot-3",
        label: "Górny prawy",
        helper: "Dodatkowe informacje",
        className: "min-h-[140px]",
      },
      {
        id: "templateE-slot-4",
        label: "Dolny lewy",
        helper: "Opis projektu",
        className: "min-h-[140px]",
      },
      {
        id: "templateE-slot-5",
        label: "Dolny środkowy",
        helper: "Multimedia",
        className: "min-h-[140px]",
      },
      {
        id: "templateE-slot-6",
        label: "Dolny prawy",
        helper: "Sekcja końcowa",
        className: "min-h-[140px]",
      },
    ],
  },
  {
    id: "templateF",
    name: "Template F",
    category: "symetryczne",
    description: "Układ 9-polowy symetryczny",
    layout: {
      container: "grid grid-cols-3 gap-1",
    },
    slots: [
      {
        id: "templateF-slot-1",
        label: "Rząd 1 - Lewy",
        helper: "Tytuł projektu",
        className: "min-h-[120px]",
      },
      {
        id: "templateF-slot-2",
        label: "Rząd 1 - Środek",
        helper: "Krótki opis",
        className: "min-h-[120px]",
      },
      {
        id: "templateF-slot-3",
        label: "Rząd 1 - Prawy",
        helper: "Technologie",
        className: "min-h-[120px]",
      },
      {
        id: "templateF-slot-4",
        label: "Rząd 2 - Lewy",
        helper: "Zdjęcie 1",
        className: "min-h-[120px]",
      },
      {
        id: "templateF-slot-5",
        label: "Rząd 2 - Środek",
        helper: "Zdjęcie 2",
        className: "min-h-[120px]",
      },
      {
        id: "templateF-slot-6",
        label: "Rząd 2 - Prawy",
        helper: "Zdjęcie 3",
        className: "min-h-[120px]",
      },
      {
        id: "templateF-slot-7",
        label: "Rząd 3 - Lewy",
        helper: "Opis szczegółowy",
        className: "min-h-[120px]",
      },
      {
        id: "templateF-slot-8",
        label: "Rząd 3 - Środek",
        helper: "Linki",
        className: "min-h-[120px]",
      },
      {
        id: "templateF-slot-9",
        label: "Rząd 3 - Prawy",
        helper: "Dodatkowe info",
        className: "min-h-[120px]",
      },
    ],
  },
  // KATEGORIA: PIONOWE
  {
    id: "templateC",
    name: "Template C",
    category: "pionowe",
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
    id: "templateG",
    name: "Template G",
    category: "pionowe",
    description: "Cztery sekcje w pionie",
    layout: {
      container: "flex flex-col gap-4",
    },
    slots: [
      {
        id: "templateG-slot-1",
        label: "Sekcja 1",
        helper: "Tytuł i wprowadzenie",
        className: "min-h-[120px]",
      },
      {
        id: "templateG-slot-2",
        label: "Sekcja 2",
        helper: "Technologie i opis",
        className: "min-h-[120px]",
      },
      {
        id: "templateG-slot-3",
        label: "Sekcja 3",
        helper: "Multimedia i galeria",
        className: "min-h-[120px]",
      },
      {
        id: "templateG-slot-4",
        label: "Sekcja 4",
        helper: "Linki i dodatkowe info",
        className: "min-h-[120px]",
      },
    ],
  },
  {
    id: "templateH",
    name: "Template H",
    category: "pionowe",
    description: "Pięć sekcji w pionie",
    layout: {
      container: "flex flex-col gap-3",
    },
    slots: [
      {
        id: "templateH-slot-1",
        label: "Nagłówek",
        helper: "Tytuł projektu",
        className: "min-h-[100px]",
      },
      {
        id: "templateH-slot-2",
        label: "Wprowadzenie",
        helper: "Krótki opis",
        className: "min-h-[100px]",
      },
      {
        id: "templateH-slot-3",
        label: "Technologie",
        helper: "Stack technologiczny",
        className: "min-h-[100px]",
      },
      {
        id: "templateH-slot-4",
        label: "Szczegóły",
        helper: "Opis i multimedia",
        className: "min-h-[100px]",
      },
      {
        id: "templateH-slot-5",
        label: "Linki",
        helper: "GitHub i Live",
        className: "min-h-[100px]",
      },
    ],
  },
  // KATEGORIA: POZIOME
  {
    id: "templateI",
    name: "Template I",
    category: "poziome",
    description: "Trzy sekcje poziome",
    layout: {
      container: "flex flex-col md:flex-row gap-4",
    },
    slots: [
      {
        id: "templateI-slot-1",
        label: "Lewa sekcja",
        helper: "Tytuł i opis",
        className: "flex-1 min-h-[200px]",
      },
      {
        id: "templateI-slot-2",
        label: "Środkowa sekcja",
        helper: "Technologie",
        className: "flex-1 min-h-[200px]",
      },
      {
        id: "templateI-slot-3",
        label: "Prawa sekcja",
        helper: "Linki i multimedia",
        className: "flex-1 min-h-[200px]",
      },
    ],
  },
  {
    id: "templateJ",
    name: "Template J",
    category: "poziome",
    description: "Cztery sekcje poziome",
    layout: {
      container: "flex flex-col md:flex-row gap-3",
    },
    slots: [
      {
        id: "templateJ-slot-1",
        label: "Sekcja 1",
        helper: "Tytuł",
        className: "flex-1 min-h-[180px]",
      },
      {
        id: "templateJ-slot-2",
        label: "Sekcja 2",
        helper: "Opis",
        className: "flex-1 min-h-[180px]",
      },
      {
        id: "templateJ-slot-3",
        label: "Sekcja 3",
        helper: "Technologie",
        className: "flex-1 min-h-[180px]",
      },
      {
        id: "templateJ-slot-4",
        label: "Sekcja 4",
        helper: "Linki",
        className: "flex-1 min-h-[180px]",
      },
    ],
  },
  {
    id: "templateK",
    name: "Template K",
    category: "poziome",
    description: "Dwie szerokie sekcje poziome",
    layout: {
      container: "flex flex-col md:flex-row gap-4",
    },
    slots: [
      {
        id: "templateK-slot-1",
        label: "Lewa sekcja",
        helper: "Tytuł, opis i technologie",
        className: "flex-1 min-h-[250px]",
      },
      {
        id: "templateK-slot-2",
        label: "Prawa sekcja",
        helper: "Multimedia i linki",
        className: "flex-1 min-h-[250px]",
      },
    ],
  },
  // KATEGORIA: MOZAIKA
  {
    id: "templateD",
    name: "Template D",
    category: "mozaika",
    description: "Asymetryczna mozaika 1 + 2",
    layout: {
      container: "grid grid-cols-3 gap-4 items-start",
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
  {
    id: "templateL",
    name: "Template L",
    category: "mozaika",
    description: "Złożona mozaika asymetryczna",
    layout: {
      container: "grid grid-cols-4 gap-3 items-start",
    },
    slots: [
      {
        id: "templateL-slot-1",
        label: "Duży blok",
        helper: "Główna sekcja",
        className: "col-span-3 row-span-2 min-h-[240px]",
      },
      {
        id: "templateL-slot-2",
        label: "Mały 1",
        helper: "Technologie",
        className: "col-span-1 min-h-[110px]",
      },
      {
        id: "templateL-slot-3",
        label: "Mały 2",
        helper: "Linki",
        className: "col-span-1 min-h-[110px]",
      },
      {
        id: "templateL-slot-4",
        label: "Średni",
        helper: "Opis",
        className: "col-span-2 min-h-[110px]",
      },
    ],
  },
  {
    id: "templateM",
    name: "Template M",
    category: "mozaika",
    description: "Zigzag - naprzemienny układ",
    layout: {
      container: "grid grid-cols-3 gap-4 items-start",
    },
    slots: [
      {
        id: "templateM-slot-1",
        label: "Górny lewy",
        helper: "Tytuł",
        className: "col-span-2 min-h-[150px]",
      },
      {
        id: "templateM-slot-2",
        label: "Górny prawy",
        helper: "Technologie",
        className: "col-span-1 min-h-[150px]",
      },
      {
        id: "templateM-slot-3",
        label: "Środkowy lewy",
        helper: "Opis",
        className: "col-span-1 min-h-[150px]",
      },
      {
        id: "templateM-slot-4",
        label: "Środkowy prawy",
        helper: "Multimedia",
        className: "col-span-2 min-h-[150px]",
      },
      {
        id: "templateM-slot-5",
        label: "Dolny",
        helper: "Linki",
        className: "col-span-3 min-h-[120px]",
      },
    ],
  },
  {
    id: "templateB",
    name: "Template B",
    category: "mozaika",
    description: "Duża sekcja + dwa mniejsze bloki",
    layout: {
      container: "grid grid-cols-2 gap-4 items-start",
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
];

