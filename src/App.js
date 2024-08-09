import logo from "./logo.svg";
import "./App.css";
import { useRoutes } from "react-router-dom";
import { AppRoutes } from "./Routes";

function App() {
  const appNav = useRoutes(AppRoutes);

  return (
    <div className="App">
        {appNav}
    </div>
  );
}

export default App;
