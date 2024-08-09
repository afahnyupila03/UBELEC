import logo from "./logo.svg";
import "./App.css";
import { useRoutes } from "react-router-dom";
import { AppRoutes } from "./Routes";
import NavbarComponent from "./Pages/Home/Layout/Navbar";

function App() {
  const appNav = useRoutes(AppRoutes);

  return (
    <div className="App">
      <NavbarComponent />
        {appNav}
    </div>
  );
}

export default App;
