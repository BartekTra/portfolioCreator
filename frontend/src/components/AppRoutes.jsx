import { Route, Routes } from "react-router-dom";
import ProjectsList from "./ProjectsList";
import EditProjectForm from "./EditProjectForm";
import MainPage from "./MainPage";
import LoginPage from "./LoginPage";
import RegisterPage from "./RegisterPage";
import DynamicProjectForm from "./DynamicProjectForm";
import ProjectView from "./ProjectView";
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
    </Routes>
  );
}

export default AppRoutes;
