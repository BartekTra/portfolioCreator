import { Route, Routes } from "react-router-dom";
import Layout from "./Layout";
import ProjectsList from "./ProjectsList";
import EditProjectForm from "./EditProjectForm";
import LoginPage from "./LoginPage";
import RegisterPage from "./RegisterPage";
import ForgotPasswordPage from "./ForgotPasswordPage";
import ResetPasswordPage from "./ResetPasswordPage";
import DynamicProjectForm from "./DynamicProjectForm";
import ProjectView from "./ProjectView";
import RepositoriesList from "./RepositoriesList";
import RepositoryForm from "./RepositoryForm";
import RepositoryView from "./RepositoryView";
import TitlePageList from "./TitlePageList";
import TitlePageForm from "./TitlePageForm";
import TitlePageView from "./TitlePageView";
import UserProfile from "./UserProfile";
import UserProfileForm from "./UserProfileForm";

function AppRoutes() {
  return (
    <Routes>
      {/* Trasy bez navbara */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      
      {/* Trasy z navbarem */}
      <Route
        path="/"
        element={
          <Layout>
            <ProjectsList />
          </Layout>
        }
      />
      <Route
        path="/projects/new"
        element={
          <Layout>
            <DynamicProjectForm />
          </Layout>
        }
      />
      <Route
        path="/projects/:id"
        element={
          <Layout>
            <ProjectView />
          </Layout>
        }
      />
      <Route
        path="/projects/:id/edit"
        element={
          <Layout>
            <EditProjectForm />
          </Layout>
        }
      />
      <Route
        path="/repositories"
        element={
          <Layout>
            <RepositoriesList />
          </Layout>
        }
      />
      <Route
        path="/repositories/new"
        element={
          <Layout>
            <RepositoryForm />
          </Layout>
        }
      />
      <Route
        path="/repositories/:id"
        element={
          <Layout>
            <RepositoryView />
          </Layout>
        }
      />
      <Route
        path="/repositories/:id/edit"
        element={
          <Layout>
            <RepositoryForm />
          </Layout>
        }
      />
      <Route
        path="/title_pages"
        element={
          <Layout>
            <TitlePageList />
          </Layout>
        }
      />
      <Route
        path="/title_pages/new"
        element={
          <Layout>
            <TitlePageForm />
          </Layout>
        }
      />
      <Route
        path="/title_pages/:id"
        element={
          <Layout>
            <TitlePageView />
          </Layout>
        }
      />
      <Route
        path="/title_pages/:id/edit"
        element={
          <Layout>
            <TitlePageForm />
          </Layout>
        }
      />
      <Route
        path="/profile"
        element={
          <Layout>
            <UserProfile />
          </Layout>
        }
      />
      <Route
        path="/profile/edit"
        element={
          <Layout>
            <UserProfileForm />
          </Layout>
        }
      />
    </Routes>
  );
}

export default AppRoutes;
