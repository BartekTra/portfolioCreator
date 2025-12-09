import { Route, Routes } from "react-router-dom";
import ProjectsList from "./ProjectsList";
import EditProjectForm from "./EditProjectForm";
import MainPage from "./MainPage";
import LoginPage from "./LoginPage";
import RegisterPage from "./RegisterPage";
import DynamicProjectForm from "./DynamicProjectForm";
import ProjectView from "./ProjectView";
import RepositoriesList from "./RepositoriesList";
import RepositoryForm from "./RepositoryForm";
import RepositoryView from "./RepositoryView";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/ajkfsgn" element={<MainPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/" element={<ProjectsList />} />
      <Route path="/projects/new" element={<DynamicProjectForm />} />
      <Route path="/projects/:id" element={<ProjectView />} />
      <Route path="/projects/:id/edit" element={<EditProjectForm />} />
      <Route path="/repositories" element={<RepositoriesList />} />
      <Route path="/repositories/new" element={<RepositoryForm />} />
      <Route path="/repositories/:id" element={<RepositoryView />} />
      <Route path="/repositories/:id/edit" element={<RepositoryForm />} />
    </Routes>
  );
}

export default AppRoutes;
