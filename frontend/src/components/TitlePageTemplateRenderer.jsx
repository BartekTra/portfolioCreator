import React from "react";

const TITLE_TEMPLATES = {
  titleTemplate1: {
    name: "Template 1",
    description: "Klasyczny układ z dużą fotografią",
    render: (titlePage) => (
      <div className="space-y-6">
        {titlePage.photo_url && (
          <div className="flex justify-center">
            <img
              src={titlePage.photo_url}
              alt="Zdjęcie profilowe"
              className="w-48 h-48 rounded-full object-cover border-4 border-gray-200 dark:border-gray-600"
            />
          </div>
        )}

        <div className="grid gap-4 md:grid-cols-2">
          {titlePage.phone && (
            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                Telefon
              </h3>
              <p className="text-gray-800 dark:text-gray-200">{titlePage.phone}</p>
            </div>
          )}
          {titlePage.email && (
            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                Email
              </h3>
              <p className="text-gray-800 dark:text-gray-200">{titlePage.email}</p>
            </div>
          )}
        </div>

        {titlePage.address && (
          <div>
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
              Adres
            </h3>
            <p className="text-gray-800 dark:text-gray-200">{titlePage.address}</p>
          </div>
        )}

        {titlePage.bio && (
          <div>
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
              Opis
            </h3>
            <p className="text-gray-800 dark:text-gray-200 whitespace-pre-line">
              {titlePage.bio}
            </p>
          </div>
        )}

        {titlePage.experience && titlePage.experience.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
              Doświadczenie zawodowe
            </h3>
            <div className="space-y-4">
              {titlePage.experience.map((exp, index) => (
                <div
                  key={index}
                  className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border-l-4 border-blue-500"
                >
                  <h4 className="font-semibold text-gray-800 dark:text-gray-200">
                    {exp.position || "Stanowisko"}
                  </h4>
                  <p className="text-gray-600 dark:text-gray-300 mb-1">
                    {exp.company || "Firma"}
                  </p>
                  {exp.period && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                      {exp.period}
                    </p>
                  )}
                  {exp.description && (
                    <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                      {exp.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    ),
  },
  titleTemplate2: {
    name: "Template 2",
    description: "Nowoczesny układ z akcentem na tekst",
    render: (titlePage) => (
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row gap-6 items-start">
          {titlePage.photo_url && (
            <div className="flex-shrink-0">
              <img
                src={titlePage.photo_url}
                alt="Zdjęcie profilowe"
                className="w-32 h-32 rounded-lg object-cover shadow-lg"
              />
            </div>
          )}
          <div className="flex-1">
            {titlePage.bio && (
              <div className="mb-6">
                <p className="text-lg text-gray-800 dark:text-gray-200 leading-relaxed whitespace-pre-line">
                  {titlePage.bio}
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3 border-t border-gray-200 dark:border-gray-700 pt-6">
          {titlePage.phone && (
            <div>
              <h3 className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-2">
                Telefon
              </h3>
              <p className="text-gray-800 dark:text-gray-200 font-medium">{titlePage.phone}</p>
            </div>
          )}
          {titlePage.email && (
            <div>
              <h3 className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-2">
                Email
              </h3>
              <p className="text-gray-800 dark:text-gray-200 font-medium">{titlePage.email}</p>
            </div>
          )}
          {titlePage.address && (
            <div>
              <h3 className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-2">
                Adres
              </h3>
              <p className="text-gray-800 dark:text-gray-200 font-medium">{titlePage.address}</p>
            </div>
          )}
        </div>

        {titlePage.experience && titlePage.experience.length > 0 && (
          <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-6">
              Doświadczenie zawodowe
            </h3>
            <div className="space-y-6">
              {titlePage.experience.map((exp, index) => (
                <div
                  key={index}
                  className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-700 dark:to-gray-800 rounded-xl shadow-sm"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="text-lg font-bold text-gray-800 dark:text-gray-200">
                      {exp.position || "Stanowisko"}
                    </h4>
                    {exp.period && (
                      <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                        {exp.period}
                      </span>
                    )}
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 font-semibold mb-3">
                    {exp.company || "Firma"}
                  </p>
                  {exp.description && (
                    <p className="text-gray-600 dark:text-gray-400 whitespace-pre-line">
                      {exp.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    ),
  },
  titleTemplate3: {
    name: "Template 3",
    description: "Minimalistyczny układ z wyróżnionymi danymi kontaktowymi",
    render: (titlePage) => (
      <div className="space-y-8">
        <div className="text-center space-y-4">
          {titlePage.photo_url && (
            <div className="flex justify-center">
              <img
                src={titlePage.photo_url}
                alt="Zdjęcie profilowe"
                className="w-40 h-40 rounded-full object-cover border-4 border-blue-500 dark:border-blue-400 shadow-xl"
              />
            </div>
          )}
          {titlePage.bio && (
            <div className="max-w-2xl mx-auto">
              <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed whitespace-pre-line">
                {titlePage.bio}
              </p>
            </div>
          )}
        </div>

        <div className="flex flex-wrap justify-center gap-8 py-6 border-y border-gray-200 dark:border-gray-700">
          {titlePage.phone && (
            <div className="text-center">
              <h3 className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">
                Telefon
              </h3>
              <p className="text-gray-900 dark:text-gray-100 font-semibold text-lg">
                {titlePage.phone}
              </p>
            </div>
          )}
          {titlePage.email && (
            <div className="text-center">
              <h3 className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">
                Email
              </h3>
              <p className="text-gray-900 dark:text-gray-100 font-semibold text-lg">
                {titlePage.email}
              </p>
            </div>
          )}
          {titlePage.address && (
            <div className="text-center">
              <h3 className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">
                Adres
              </h3>
              <p className="text-gray-900 dark:text-gray-100 font-semibold text-lg">
                {titlePage.address}
              </p>
            </div>
          )}
        </div>

        {titlePage.experience && titlePage.experience.length > 0 && (
          <div>
            <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-6 text-center">
              Doświadczenie zawodowe
            </h3>
            <div className="max-w-3xl mx-auto space-y-4">
              {titlePage.experience.map((exp, index) => (
                <div
                  key={index}
                  className="p-5 border-2 border-gray-200 dark:border-gray-700 rounded-lg hover:border-blue-500 dark:hover:border-blue-400 transition-colors"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="text-lg font-bold text-gray-800 dark:text-gray-200">
                        {exp.position || "Stanowisko"}
                      </h4>
                      <p className="text-gray-600 dark:text-gray-400 font-medium">
                        {exp.company || "Firma"}
                      </p>
                    </div>
                    {exp.period && (
                      <span className="text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">
                        {exp.period}
                      </span>
                    )}
                  </div>
                  {exp.description && (
                    <p className="text-gray-700 dark:text-gray-300 mt-3 whitespace-pre-line">
                      {exp.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    ),
  },
};

function TitlePageTemplateRenderer({ titlePage }) {
  if (!titlePage) return null;

  const templateKey = titlePage.template_key || "titleTemplate1";
  const template = TITLE_TEMPLATES[templateKey] || TITLE_TEMPLATES.titleTemplate1;

  return template.render(titlePage);
}

export default TitlePageTemplateRenderer;

