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
import TitlePageList from "./TitlePageList";
import TitlePageForm from "./TitlePageForm";
import TitlePageView from "./TitlePageView";

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
      <Route path="/title_pages" element={<TitlePageList />} />
      <Route path="/title_pages/new" element={<TitlePageForm />} />
      <Route path="/title_pages/:id" element={<TitlePageView />} />
      <Route path="/title_pages/:id/edit" element={<TitlePageForm />} />
    </Routes>
  );
}

export default AppRoutes;
