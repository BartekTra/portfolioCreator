import { Route, Routes } from "react-router-dom";
import AuthViewHelper from "./AuthViewHelper";
import ProjectsList from "./ProjectsList";
import NewProjectForm from "./NewProjectForm";
import ProjectDetails from "./ProjectDetails";
import EditProjectForm from "./EditProjectForm";
import MainPage from "./MainPage";
import LoginPage from "./LoginPage";
import RegisterPage from "./RegisterPage";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<MainPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/projects" element={<ProjectsList />} />
      <Route path="/projects/new" element={<NewProjectForm />} />
      <Route path="/projects/:id" element={<ProjectDetails />} />
      <Route path="/projects/:id/edit" element={<EditProjectForm />} />
    </Routes>
  );
}

export default AppRoutes;
