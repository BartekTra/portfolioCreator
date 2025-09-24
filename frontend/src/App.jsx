import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import LoginPage from "./components/LoginPage";
import MainPage from "./components/MainPage";
import AuthViewHelper from "./components/AuthViewHelper";
function App() {
  const [count, setCount] = useState(0);

  return (
    <ApolloProvider client={client}>
      <AuthViewHelper />
    </ApolloProvider>
  );
}

export default App;
