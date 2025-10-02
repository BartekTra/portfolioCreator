import { Route, Routes } from "react-router-dom";
import AuthViewHelper from "./AuthViewHelper";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<AuthViewHelper />} />
    </Routes>
  );
}

export default AppRoutes;
