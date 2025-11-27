import React from "react";
import ProjectTemplateRenderer from "./ProjectTemplateRenderer";

function ProjectView({ project }) {
  if (!project?.data) {
    return null;
  }

  return (
    <div className="space-y-6">
      <ProjectTemplateRenderer project={project} />
    </div>
  );
}

export default ProjectView;