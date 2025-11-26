// ProjectView.jsx - komponent do wyświetlania projektu
function ProjectView({ project }) {
  console.log(project);
  const renderSection = (section) => {
    switch (section.type) {
      case "title":
        return <h1 className="text-4xl font-bold dark:text-gray-100">{section.value}</h1>;

      case "description":
        return (
          <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{section.value}</p>
        );

      case "technologies":
        return (
          <div className="flex flex-wrap gap-2">
            {section.value.map((tech, i) => (
              <span
                key={i}
                className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded"
              >
                {tech}
              </span>
            ))}
          </div>
        );

      case "image":
        const sectionImages = project.images.filter(
          (img) => img.section_id === section.id
        );
        return (
          <div className="grid grid-cols-2 gap-4">
            {sectionImages.map((img, i) => (
              <img
                key={i}
                src={img.url}
                alt={`Image ${i + 1}`}
                className="rounded-lg"
              />
            ))}
          </div>
        );

      case "github_url":
        return (
          <a
            href={section.value}
            className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-2"
          >
             Zobacz kod na GitHub
          </a>
        );

      case "live_url":
        return (
          <a
            href={section.value}
            className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-2"
          >
             Zobacz na żywo
          </a>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {project.data.sections
        .sort((a, b) => a.order - b.order)
        .map((section) => (
          <div key={section.id} className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-gray-700">
            {renderSection(section)}
          </div>
        ))}
    </div>
  );
}

export default ProjectView;